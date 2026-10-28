import * as vscode from 'vscode';
import { EntityMapBuilder } from './core/EntityMapBuilder';
import { CommandController } from './adapters/CommandController';
import { VscodeConfigurationProvider } from './adapters/VscodeConfigurationProvider';

/** Command id replacing characters in the whole document. */
const COMMAND_REPLACE_IN_DOCUMENT = 'htmlentityswaper.replaceInDocument';
/** Command id replacing characters within the current selection. */
const COMMAND_REPLACE_IN_SELECTION = 'htmlentityswaper.replaceInSelection';

/** Information message shown when a command runs without an active editor. */
const MESSAGE_NO_ACTIVE_EDITOR = 'No active editor.';

/**
 * Run a command body guarded by an active editor, surfacing any failure to the
 * user instead of letting it leak out of the command handler.
 * @param run Callback receiving the active editor.
 */
async function withActiveEditor(run: (editor: vscode.TextEditor) => Promise<void>): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (undefined === editor) {
    await vscode.window.showInformationMessage(MESSAGE_NO_ACTIVE_EDITOR);
    return;
  }
  try {
    await run(editor);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    await vscode.window.showErrorMessage(`HTML Entity Swapper: ${message}`);
  }
}

/**
 * Activate the extension: wire dependencies and register the two commands,
 * pushing every disposable into the subscriptions.
 *
 * Dependency injection is performed here (composition root): the configuration
 * provider and the controller are instantiated and connected. The controller
 * rebuilds the entity map on every command from the current settings, so the
 * extension is fully stateless and no configuration-change listener is needed:
 * a settings change is picked up on the next command with no window reload.
 * @param context The extension context owning the disposables.
 */
export function activate(context: vscode.ExtensionContext): void {
  const configurationProvider = new VscodeConfigurationProvider();
  const controller = new CommandController(configurationProvider, () => new EntityMapBuilder());

  const replaceInDocument = vscode.commands.registerCommand(
    COMMAND_REPLACE_IN_DOCUMENT,
    (): Promise<void> => withActiveEditor((editor) => controller.replaceInDocument(editor)),
  );

  const replaceInSelection = vscode.commands.registerCommand(
    COMMAND_REPLACE_IN_SELECTION,
    (): Promise<void> => withActiveEditor((editor) => controller.replaceInSelection(editor)),
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
