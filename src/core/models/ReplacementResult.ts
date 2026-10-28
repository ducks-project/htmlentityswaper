import type { Replacement } from './Replacement';

/**
 * Immutable value object aggregating the outcome of a replacement computation.
 *
 * It holds the ordered list of edits to apply and a convenience `count`. Being
 * a pure value object, it never mutates and carries no dependency on `vscode`.
 */
export interface IReplacementResult {
  /** Ordered, immutable list of replacements to apply to the document. */
  readonly edits: readonly Replacement[];
  /** Number of replacements contained in {@link edits}. */
  readonly count: number;
}

/**
 * Concrete immutable implementation of {@link IReplacementResult}.
 *
 * `count` is derived from `edits` at construction time to keep both fields in
 * sync and to avoid callers recomputing the length.
 */
export class ReplacementResult implements IReplacementResult {
  public readonly edits: readonly Replacement[];

  public readonly count: number;

  /**
   * Build an immutable replacement result.
   * @param edits Ordered list of replacements; defensively frozen by the caller.
   */
  public constructor(edits: readonly Replacement[]) {
    this.edits = edits;
    this.count = edits.length;
  }
}
