import type { ITextDocument } from '../../core/ports/ITextDocument';
import type { Replacement } from '../../core/models/Replacement';
import type { IActiveSelection } from './IActiveSelection';

/**
 * Port (Dependency Inversion) abstracting the active editor the replacement
 * commands operate on, decoupled from the `vscode` namespace.
 *
 * It is the opaque handle the command runner forwards to a command body, now
 * given the exact shape the {@link CommandController} consumes (Interface
 * Segregation): a read-only document view, the active selection, and the single
 * grouped-edit apply. In production a thin `vscode`-backed adapter wraps a real
 * `vscode.TextEditor`; at test time a test double exposes a seeded document,
 * selection, and an edit recorder, so the controller is exercisable without a
 * real editor. The grouped-edit construction (`WorkspaceEdit`, `Range`,
 * `positionAt`, `uri`, `applyEdit`) is confined to the concrete adapter.
 */
export interface IReplacementEditor {
  /**
   * Return the read-only document view the core scans for replacements.
   * @returns The wrapped document exposed through {@link ITextDocument}.
   */
  getDocument(): ITextDocument;

  /**
   * Return the active selection of the editor.
   * @returns The selection exposed through {@link IActiveSelection}.
   */
  getSelection(): IActiveSelection;

  /**
   * Apply every replacement as a SINGLE grouped, undoable edit.
   *
   * The whole batch is applied as one operation so a single undo reverts it.
   * The caller passes the replacements already ordered last-to-first, so an
   * earlier edit never shifts the offsets of a later one; the adapter applies
   * them in the given order without reordering.
   * @param replacements The replacements to apply, ordered last-to-first.
   * @returns A promise resolving once the grouped edit has been applied.
   */
  applyGroupedEdit(replacements: readonly Replacement[]): Promise<void>;
}
