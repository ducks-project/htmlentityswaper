/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
// Scaffold stub (FEAT-002): method bodies are not implemented yet, so parameters
// are unused and methods do not reference `this`. These lint rules are disabled
// at file scope until the logic lands; remove this directive once implemented.

import type { ITextDocument } from './ports/ITextDocument';
import type { EntityMap } from './EntityMap';
import { ReplacementResult } from './models/ReplacementResult';

/**
 * Inclusive-start / exclusive-end range over a document, expressed in editor
 * coordinates (line + character), free of any `vscode` type.
 */
export interface IReplacementRange {
  /** Zero-based line index of the range start. */
  readonly startLine: number;
  /** Zero-based character offset of the range start, within `startLine`. */
  readonly startCharacter: number;
  /** Zero-based line index of the range end. */
  readonly endLine: number;
  /** Zero-based character offset of the range end, within `endLine`. */
  readonly endCharacter: number;
}

/**
 * Pure computation engine that finds the replacements to apply to a document.
 *
 * It performs no mutation and imports no `vscode` type: it reads an abstract
 * {@link ITextDocument}, consults an {@link EntityMap}, and returns an immutable
 * {@link ReplacementResult}. Applying those edits is the adapter's job.
 */
export class EntityReplacer {
  private readonly entityMap: EntityMap;

  /**
   * Build a replacer bound to an immutable entity map.
   * @param entityMap The lookup table used to resolve replacements.
   */
  public constructor(entityMap: EntityMap) {
    this.entityMap = entityMap;
  }

  /**
   * Compute every replacement for a document, optionally restricted to a range.
   * @param document Abstract read-only document to scan.
   * @param range Optional sub-range to limit the scan; whole document if omitted.
   * @returns An immutable result listing the edits to apply.
   */
  public computeReplacements(
    document: ITextDocument,
    range?: IReplacementRange,
  ): ReplacementResult {
    // TODO: implemented in a later feature.
    throw new Error('Not implemented');
  }
}
