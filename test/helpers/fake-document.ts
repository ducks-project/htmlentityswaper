import type { ITextDocument } from '../../src/core/ports/ITextDocument';

/** Line separator used to split the backing text into lines. */
const LINE_FEED = '\n';

/**
 * In-memory {@link ITextDocument} built from a plain string, for unit and
 * property tests that need a document without a real editor.
 *
 * Lines are split on `\n`; `lineAt` returns a line without its EOL marker and
 * `getText` returns the original string verbatim (separators included), so an
 * absolute offset into `getText()` matches the offsets produced by
 * `EntityReplacer`.
 */
export class FakeDocument implements ITextDocument {
  private readonly text: string;

  private readonly lines: readonly string[];

  /**
   * Build a fake document from its full text.
   * @param text The entire document text.
   */
  public constructor(text: string) {
    this.text = text;
    this.lines = text.split(LINE_FEED);
  }

  /** Total number of lines in the document. */
  public get lineCount(): number {
    return this.lines.length;
  }

  /**
   * Return the text of a single line, without its end-of-line marker.
   * @param index Zero-based line index.
   * @returns The raw text of the requested line.
   */
  public lineAt(index: number): string {
    return this.lines[index];
  }

  /**
   * Return the full text of the document.
   * @returns The entire document text.
   */
  public getText(): string {
    return this.text;
  }
}
