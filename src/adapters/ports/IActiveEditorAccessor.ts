import type { IEditorHandle } from '../../core/ports/IEditorHandle';

/**
 * Port (Dependency Inversion) supplying the currently active editor to the
 * command runner, decoupled from the `vscode` namespace.
 *
 * The contract is intentionally minimal (Interface Segregation): the runner
 * only needs to know whether an editor is active and, if so, obtain its opaque
 * {@link IEditorHandle}. In production a thin `vscode`-backed adapter returns
 * `vscode.window.activeTextEditor`; at test time a test double returns a stub
 * handle or `undefined`, so the guard is exercisable without an editor.
 */
export interface IActiveEditorAccessor {
  /**
   * Return the active editor handle, or `undefined` when no editor is active.
   * @returns The opaque active-editor handle, or `undefined` when none is active.
   */
  getActiveEditor(): IEditorHandle | undefined;
}
