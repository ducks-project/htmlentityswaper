import type { IEditorHandle } from '../core/ports/IEditorHandle';
import type { IActiveEditorAccessor } from './ports/IActiveEditorAccessor';
import type { IMessageSink } from './ports/IMessageSink';
import type { ICommandRunner } from './ports/ICommandRunner';

/** Information message shown when a command runs without an active editor. */
const MESSAGE_NO_ACTIVE_EDITOR = 'No active editor.';

/** Prefix prepended to a command-body failure before it is surfaced. */
const ERROR_MESSAGE_PREFIX = 'HTML Entity Swapper: ';

/**
 * Adapter hosting the active-editor guard and error-surfacing control flow
 * extracted verbatim (in behaviour) from the composition root.
 *
 * It implements {@link ICommandRunner} on top of two injected ports: an
 * {@link IActiveEditorAccessor} supplying the active editor and an
 * {@link IMessageSink} surfacing failures. Depending on these abstractions
 * instead of the `vscode` namespace keeps the guard and the error wrapper
 * reachable by the in-process unit suite (Dependency Inversion).
 */
export class CommandRunner implements ICommandRunner {
  private readonly activeEditorAccessor: IActiveEditorAccessor;

  private readonly messageSink: IMessageSink;

  /**
   * @param activeEditorAccessor Source of the currently active editor handle.
   * @param messageSink Surface for user-facing error messages.
   */
  public constructor(activeEditorAccessor: IActiveEditorAccessor, messageSink: IMessageSink) {
    this.activeEditorAccessor = activeEditorAccessor;
    this.messageSink = messageSink;
  }

  /**
   * Guard for an active editor, then run the body, surfacing failures.
   *
   * When no editor is active the body is not invoked and `No active editor.`
   * is surfaced; otherwise the body runs and any thrown failure is wrapped as
   * `HTML Entity Swapper: <message>` and surfaced via the message sink.
   * @param body Callback receiving the active editor handle.
   * @returns A promise resolving once the guard and the body have settled.
   */
  public async withActiveEditor(
    body: (editor: IEditorHandle) => void | Promise<void>,
  ): Promise<void> {
    const editor = this.activeEditorAccessor.getActiveEditor();
    if (undefined === editor) {
      this.messageSink.showError(MESSAGE_NO_ACTIVE_EDITOR);
      return;
    }
    try {
      await body(editor);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.messageSink.showError(`${ERROR_MESSAGE_PREFIX}${message}`);
    }
  }
}
