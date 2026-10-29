import type { ITextDocument } from '../../src/core/ports/ITextDocument';
import type { Replacement } from '../../src/core/models/Replacement';
import type { IReplacementEditor } from '../../src/adapters/ports/IReplacementEditor';
import type { IActiveSelection } from '../../src/adapters/ports/IActiveSelection';

/**
 * Test double conforming to the full {@link IReplacementEditor} contract.
 *
 * It exposes a seeded document and selection, and records every grouped-edit
 * batch handed to {@link applyGroupedEdit}. Recording each batch separately lets
 * a test assert that EXACTLY ONE grouped apply happened (the single-undo
 * guarantee) and inspect the replacements and their order, without a real
 * `vscode` editor.
 */
export class FakeReplacementEditor implements IReplacementEditor {
  public readonly appliedBatches: Array<readonly Replacement[]> = [];

  private readonly document: ITextDocument;

  private readonly selection: IActiveSelection;

  /**
   * Build the editor from its document and selection.
   * @param document The document the controller scans for replacements.
   * @param selection The active selection reported to the controller.
   */
  public constructor(document: ITextDocument, selection: IActiveSelection) {
    this.document = document;
    this.selection = selection;
  }

  /**
   * Return the seeded document view.
   * @returns The document the editor was seeded with.
   */
  public getDocument(): ITextDocument {
    return this.document;
  }

  /**
   * Return the seeded active selection.
   * @returns The selection the editor was seeded with.
   */
  public getSelection(): IActiveSelection {
    return this.selection;
  }

  /**
   * Record a grouped-edit batch instead of applying it to a real document.
   * @param replacements The replacements of the grouped edit, ordered last-to-first.
   * @returns A resolved promise, mirroring the asynchronous contract.
   */
  public async applyGroupedEdit(replacements: readonly Replacement[]): Promise<void> {
    this.appliedBatches.push(replacements);
  }
}
