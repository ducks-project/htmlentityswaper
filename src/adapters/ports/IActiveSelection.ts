import type { IReplacementRange } from '../../core/EntityReplacer';

/**
 * Port (Dependency Inversion) abstracting the active editor selection the
 * selection command needs, decoupled from the `vscode` namespace.
 *
 * The contract is intentionally minimal (Interface Segregation): the controller
 * only needs to know whether the selection is empty and, when it is not, obtain
 * its bounds as a core-owned {@link IReplacementRange}. In production a thin
 * `vscode`-backed adapter reads `editor.selection`; at test time a test double
 * reports a seeded emptiness signal and range, so the selection no-op and the
 * ranged replacement are exercisable without a real editor.
 */
export interface IActiveSelection {
  /**
   * Report whether the selection is empty (start equal to end).
   * @returns `true` when the selection covers no character, `false` otherwise.
   */
  isEmpty(): boolean;

  /**
   * Return the selection bounds as a core-owned replacement range.
   * @returns The selection expressed in `(line, character)` coordinates.
   */
  toRange(): IReplacementRange;
}
