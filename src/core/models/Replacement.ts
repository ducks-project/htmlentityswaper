/**
 * Immutable value object describing a single character-to-entity replacement
 * located inside a text document.
 *
 * All fields are `readonly`: a `Replacement` never mutates after construction.
 * Positions are expressed as absolute UTF-16 offsets into the document text,
 * so that an adapter can translate them back into editor-specific ranges.
 */
export interface IReplacement {
  /** Absolute UTF-16 offset of the first replaced code unit in the document. */
  readonly position: number;
  /** Number of UTF-16 code units covered by the original substring. */
  readonly length: number;
  /** Original substring that was matched (the source character(s)). */
  readonly original: string;
  /** HTML entity the original substring is replaced with. */
  readonly replacement: string;
}

/**
 * Concrete immutable implementation of {@link IReplacement}.
 *
 * The constructor assigns every `readonly` field once; the instance exposes no
 * mutators. Being a plain value object, it carries no dependency on `vscode`.
 */
export class Replacement implements IReplacement {
  public readonly position: number;

  public readonly length: number;

  public readonly original: string;

  public readonly replacement: string;

  /**
   * Build an immutable replacement.
   * @param position Absolute UTF-16 offset of the match start.
   * @param length UTF-16 length of the original substring.
   * @param original Source substring that was matched.
   * @param replacement HTML entity used as the substitute.
   */
  public constructor(position: number, length: number, original: string, replacement: string) {
    this.position = position;
    this.length = length;
    this.original = original;
    this.replacement = replacement;
  }
}
