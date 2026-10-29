import * as vscode from 'vscode';
import type { IEditorHandle } from './core/ports/IEditorHandle';
import type { IActiveEditorAccessor } from './adapters/ports/IActiveEditorAccessor';
import type { IMessageSink } from './adapters/ports/IMessageSink';
import { EntityMapBuilder } from './core/EntityMapBuilder';
import { CommandController } from './adapters/CommandController';
import { CommandRunner } from './adapters/CommandRunner';
import { VscodeConfigurationProvider } from './adapters/VscodeConfigurationProvider';
import { VscodeInfoMessageSink } from './adapters/VscodeInfoMessageSink';
import { VscodeReplacementEditor } from './adapters/VscodeReplacementEditor';

/** Command id replacing characters in the whole document. */
const COMMAND_REPLACE_IN_DOCUMENT = 'htmlentityswaper.replaceInDocument';
/** Command id replacing characters within the current selection. */
const COMMAND_REPLACE_IN_SELECTION = 'htmlentityswaper.replaceInSelection';

/** Message routed to the information surface rather than the error surface. */
const MESSAGE_NO_ACTIVE_EDITOR = 'No active editor.';

/**
 * Build a thin `vscode`-backed {@link IActiveEditorAccessor} supplying the
 * active editor as the command runner's opaque {@link IEditorHandle}.
 *
 * It returns `vscode.window.activeTextEditor` verbatim, so the handle the
 * runner forwards to a command body is the real `vscode.TextEditor` the body
 * casts back; no editor state is cached, keeping the extension stateless.
 * @returns An accessor reading the active editor from `vscode.window`.
 */
function createActiveEditorAccessor(): IActiveEditorAccessor {
  return {
    getActiveEditor: (): IEditorHandle | undefined => vscode.window.activeTextEditor,
  };
}

/**
 * Build a thin `vscode`-backed {@link IMessageSink} surfacing user-facing
 * messages.
 *
 * The command runner surfaces both the active-editor guard message and wrapped
 * command failures through {@link IMessageSink.showError}. To preserve the
 * baseline behaviour, the `No active editor.` guard message is routed to the
 * information surface (`showInformationMessage`) exactly as before, while every
 * wrapped command failure is routed to the error surface (`showErrorMessage`).
 * @returns A sink routing messages to the matching `vscode.window` surface.
 */
function createMessageSink(): IMessageSink {
  return {
    showError: (message: string): void => {
      const surface =
        MESSAGE_NO_ACTIVE_EDITOR === message
          ? vscode.window.showInformationMessage
          : vscode.window.showErrorMessage;
      surface(message).then(undefined, undefined);
    },
  };
}

/**
 * Activate the extension: wire dependencies and register the two commands,
 * pushing every disposable into the subscriptions.
 *
 * Dependency injection is performed here (composition root): the configuration
 * provider, the controller, and the command runner (with its `vscode`-backed
 * active-editor accessor and message sink) are instantiated and connected. The
 * controller rebuilds the entity map on every command from the current
 * settings, so the extension is fully stateless and no configuration-change
 * listener is needed: a settings change is picked up on the next command with
 * no window reload.
 * @param context The extension context owning the disposables.
 */
export function activate(context: vscode.ExtensionContext): void {
  const configurationProvider = new VscodeConfigurationProvider();
  const controller = new CommandController(
    configurationProvider,
    () => new EntityMapBuilder(),
    new VscodeInfoMessageSink(),
  );
  const runner = new CommandRunner(createActiveEditorAccessor(), createMessageSink());

  const replaceInDocument = vscode.commands.registerCommand(
    COMMAND_REPLACE_IN_DOCUMENT,
    (): Promise<void> =>
      runner.withActiveEditor((editor) =>
        controller.replaceInDocument(new VscodeReplacementEditor(editor as vscode.TextEditor)),
      ),
  );

  const replaceInSelection = vscode.commands.registerCommand(
    COMMAND_REPLACE_IN_SELECTION,
    (): Promise<void> =>
      runner.withActiveEditor((editor) =>
        controller.replaceInSelection(new VscodeReplacementEditor(editor as vscode.TextEditor)),
      ),
  );

  context.subscriptions.push(replaceInDocument, replaceInSelection);
}

/**
 * Deactivate the extension. No manual cleanup is required: every disposable was
 * registered in `context.subscriptions` and is released by the host.
 */
export function deactivate(): void {
  // Intentionally empty.
}
