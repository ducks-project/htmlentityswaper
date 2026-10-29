import type { IActiveEditorAccessor } from '../../src/adapters/ports/IActiveEditorAccessor';
import type { IEditorHandle } from '../../src/core/ports/IEditorHandle';

/**
 * Test double conforming to the full {@link IActiveEditorAccessor} contract.
 *
 * It returns the editor handle it was seeded with, so a test can simulate
 * either an active editor (a stub handle) or none (`undefined`), without a real
 * `vscode` editor.
 */
export class StubActiveEditorAccessor implements IActiveEditorAccessor {
  private readonly editor: IEditorHandle | undefined;

  /**
   * Build the accessor from the handle it should report.
   * @param editor The handle to return, or `undefined` for no active editor.
   */
  public constructor(editor: IEditorHandle | undefined) {
    this.editor = editor;
  }

  /**
   * Return the seeded editor handle.
   * @returns The seeded handle, or `undefined` when none was provided.
   */
  public getActiveEditor(): IEditorHandle | undefined {
    return this.editor;
  }
}
