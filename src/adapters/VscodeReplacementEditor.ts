import * as vscode from 'vscode';
import type { ITextDocument } from '../core/ports/ITextDocument';
import type { Replacement } from '../core/models/Replacement';
import type { IReplacementEditor } from './ports/IReplacementEditor';
import type { IActiveSelection } from './ports/IActiveSelection';
import { VscodeDocumentAdapter } from './VscodeDocumentAdapter';
import { VscodeActiveSelection } from './VscodeActiveSelection';

/**
 * Adapter exposing a `vscode.TextEditor` through the {@link IReplacementEditor}
 * contract.
 *
 * It is the single place the `vscode` grouped-edit construction lives: the
 * document and selection reads are delegated to {@link VscodeDocumentAdapter}
 * and {@link VscodeActiveSelection}, while {@link applyGroupedEdit} builds one
 * `vscode.WorkspaceEdit` (`Range`, `positionAt`, `uri`) and applies it via
 * `vscode.workspace.applyEdit`. Keeping all of this behind the port keeps
 * {@link CommandController} host-agnostic and unit-testable.
 */
export class VscodeReplacementEditor implements IReplacementEditor {
  private readonly editor: vscode.TextEditor;

  /**
   * Wrap a concrete VS Code editor.
   * @param editor The active editor to adapt.
   */
  public constructor(editor: vscode.TextEditor) {
    this.editor = editor;
  }

  /**
   * Return the read-only document view the core scans for replacements.
   * @returns The wrapped document exposed through {@link ITextDocument}.
   */
  public getDocument(): ITextDocument {
    return new VscodeDocumentAdapter(this.editor.document);
  }

  /**
   * Return the active selection of the editor.
   * @returns The selection exposed through {@link IActiveSelection}.
   */
  public getSelection(): IActiveSelection {
    return new VscodeActiveSelection(this.editor.selection);
  }

  /**
   * Apply every replacement as a SINGLE grouped `vscode.WorkspaceEdit`.
   *
   * Absolute UTF-16 offsets are converted to editor positions via
   * `document.positionAt`. The replacements are applied in the given order
   * (the caller pre-orders them last-to-first), so an earlier edit never shifts
   * the offsets of a later one, and the whole batch is one undo step.
   * @param replacements The replacements to apply, ordered last-to-first.
   * @returns A promise resolving once the grouped edit has been applied.
   */
  public async applyGroupedEdit(replacements: readonly Replacement[]): Promise<void> {
    const { document } = this.editor;
    const edit = new vscode.WorkspaceEdit();
    replacements.forEach((replacement) => {
      const range = new vscode.Range(
        document.positionAt(replacement.position),
        document.positionAt(replacement.position + replacement.length),
      );
      edit.replace(document.uri, range, replacement.replacement);
    });
    await vscode.workspace.applyEdit(edit);
  }
}
