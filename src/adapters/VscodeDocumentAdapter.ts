import * as vscode from 'vscode';
import type { ITextDocument } from '../core/ports/ITextDocument';

/**
 * Adapter exposing a `vscode.TextDocument` through the core-owned
 * {@link ITextDocument} contract.
 *
 * Keeps `EntityReplacer` free of any `vscode` type: the replacer sees only the
 * minimal read-only document interface while this class bridges the real editor
 * document behind it.
 */
export class VscodeDocumentAdapter implements ITextDocument {
  private readonly document: vscode.TextDocument;

  /**
   * Wrap a concrete VS Code document.
   * @param document The editor document to adapt.
   */
  public constructor(document: vscode.TextDocument) {
    this.document = document;
  }

  /**
   * Total number of lines in the wrapped document.
   */
  public get lineCount(): number {
    return this.document.lineCount;
  }

  /**
   * Return the raw text of a single line, without its end-of-line marker.
   * @param index Zero-based line index.
   * @returns The text content of the requested line.
   */
  public lineAt(index: number): string {
    return this.document.lineAt(index).text;
  }

  /**
   * Return the full text of the wrapped document.
   * @returns The entire document text.
   */
  public getText(): string {
    return this.document.getText();
  }
}
