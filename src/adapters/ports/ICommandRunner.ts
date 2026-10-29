import type { IEditorHandle } from '../../core/ports/IEditorHandle';

/**
 * Port (Dependency Inversion) running a command body only when an editor is
 * active, surfacing `No active editor.` otherwise and wrapping any thrown
 * failure via the injected message sink.
 *
 * The contract is intentionally minimal (Interface Segregation): the
 * composition root depends on this abstraction to register its commands, while
 * a concrete adapter (for example `CommandRunner`) holds the guard and the
 * error-surfacing control flow, keeping that logic reachable by the in-process
 * unit suite rather than buried in the `vscode`-bound composition root.
 */
export interface ICommandRunner {
  /**
   * Guard for an active editor, then run the body, surfacing failures.
   *
   * When no editor is active the body is not invoked and `No active editor.`
   * is surfaced; otherwise the body runs and any thrown failure is wrapped and
   * surfaced via the message sink.
   * @param body Callback receiving the active editor handle.
   * @returns A promise resolving once the guard and the body have settled.
   */
  withActiveEditor(body: (editor: IEditorHandle) => void | Promise<void>): Promise<void>;
}
