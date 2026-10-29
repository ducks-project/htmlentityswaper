import type { IReplacementRange } from '../../src/core/EntityReplacer';
import type { IActiveSelection } from '../../src/adapters/ports/IActiveSelection';

/**
 * Test double conforming to the full {@link IActiveSelection} contract.
 *
 * It reports a seeded emptiness signal and range, so a test can simulate either
 * an empty selection (the no-op path) or a ranged selection (the ranged
 * replacement path), without a real `vscode` selection.
 */
export class FakeActiveSelection implements IActiveSelection {
  private readonly empty: boolean;

  private readonly range: IReplacementRange;

  /**
   * Build the selection from the emptiness signal and range it should report.
   * @param empty Whether the selection is empty.
   * @param range The bounds reported by {@link toRange}.
   */
  public constructor(empty: boolean, range: IReplacementRange) {
    this.empty = empty;
    this.range = range;
  }

  /**
   * Report the seeded emptiness signal.
   * @returns `true` when the selection was seeded as empty.
   */
  public isEmpty(): boolean {
    return this.empty;
  }

  /**
   * Return the seeded selection bounds.
   * @returns The range the selection was seeded with.
   */
  public toRange(): IReplacementRange {
    return this.range;
  }
}
