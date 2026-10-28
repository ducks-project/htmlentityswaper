/**
 * Port (Dependency Inversion) abstracting the minimal read-only view of a text
 * document that the core needs to compute replacements.
 *
 * The shape is intentionally small (Interface Segregation) and free of any
 * `vscode` type: a concrete adapter (`VscodeDocumentAdapter`) bridges a real
 * editor document to this contract, keeping `EntityReplacer` host-agnostic and
 * unit-testable without an editor.
 */
export interface ITextDocument {
  /** Total number of lines in the document. */
  readonly lineCount: number;

  /**
   * Return the text content of a single line, without its end-of-line marker.
   * @param index Zero-based line index, in `[0, lineCount)`.
   * @returns The raw text of the requested line.
   */
  lineAt(index: number): string;

  /**
   * Return the full text content of the document as a single string.
   * @returns The entire document text, line separators included.
   */
  getText(): string;
}
