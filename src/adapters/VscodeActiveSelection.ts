import type * as vscode from 'vscode';
import type { IReplacementRange } from '../core/EntityReplacer';
import type { IActiveSelection } from './ports/IActiveSelection';

/**
 * Adapter exposing a `vscode.Selection` through the {@link IActiveSelection}
 * contract.
 *
 * It confines the `editor.selection` read to a thin shell: `isEmpty` forwards
 * the selection emptiness signal and `toRange` converts the selection bounds to
 * a core-owned {@link IReplacementRange}, keeping {@link CommandController} free
 * of any `vscode` type.
 */
export class VscodeActiveSelection implements IActiveSelection {
  private readonly selection: vscode.Selection;

  /**
   * Wrap a concrete VS Code selection.
   * @param selection The editor selection to adapt.
   */
  public constructor(selection: vscode.Selection) {
    this.selection = selection;
  }

  /**
   * Report whether the selection is empty (start equal to end).
   * @returns `true` when the selection covers no character, `false` otherwise.
   */
  public isEmpty(): boolean {
    return this.selection.isEmpty;
  }

  /**
   * Return the selection bounds as a core-owned replacement range.
   * @returns The selection expressed in `(line, character)` coordinates.
   */
  public toRange(): IReplacementRange {
    return {
      startLine: this.selection.start.line,
      startCharacter: this.selection.start.character,
      endLine: this.selection.end.line,
      endCharacter: this.selection.end.character,
    };
  }
}
