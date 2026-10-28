import type { ITextDocument } from './ports/ITextDocument';
import type { EntityMap } from './EntityMap';
import { Replacement } from './models/Replacement';
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

/** Number of UTF-16 code units of a single BMP code point. */
const BMP_CODE_UNIT_LENGTH = 1;
/** Line-feed marker used to locate line starts in the raw document text. */
const LINE_FEED = '\n';
/** Sentinel returned by `indexOf` when a line feed is not found. */
const NOT_FOUND = -1;

/**
 * Convert an editor `(line, character)` position into an absolute UTF-16
 * code-unit offset into `text`.
 *
 * Line separators are taken from `text` itself (every `\n`, with any preceding
 * `\r` kept inside the previous line), so the computed offset matches the
 * document exactly whatever the EOL convention. A position beyond the end of the
 * text is clamped to the text length.
 * @param text Full document text.
 * @param line Zero-based target line index.
 * @param character Zero-based UTF-16 character offset within the target line.
 * @returns The absolute UTF-16 offset of the position.
 */
function offsetOf(text: string, line: number, character: number): number {
  let offset = 0;
  let currentLine = 0;
  while (currentLine < line && offset < text.length) {
    const nextBreak = text.indexOf(LINE_FEED, offset);
    if (NOT_FOUND === nextBreak) {
      return text.length;
    }
    offset = nextBreak + 1;
    currentLine += 1;
  }
  return Math.min(offset + character, text.length);
}

/**
 * Pure computation engine that finds the replacements to apply to a document.
 *
 * It performs no mutation and imports no `vscode` type: it reads an abstract
 * {@link ITextDocument}, consults an {@link EntityMap}, and returns an immutable
 * {@link ReplacementResult}. Applying those edits is the adapter's job.
 *
 * Iteration strategy
 * ------------------
 * The document text is scanned by code POINT (`Array.from` splits on code point
 * boundaries) while an absolute UTF-16 code-UNIT offset is tracked and advanced
 * by each code point's `char.length` (2 for an astral/non-BMP code point). The
 * entity table only ever contains single-code-unit BMP keys, so an astral code
 * point never matches and is consumed as one indivisible iteration unit: a
 * surrogate pair is never split and the emitted offsets always stay aligned with
 * `getText()`, which is the UTF-16 offset space VS Code positions use.
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
    const text = document.getText();
    const startOffset =
      undefined === range ? 0 : offsetOf(text, range.startLine, range.startCharacter);
    const endOffset =
      undefined === range ? text.length : offsetOf(text, range.endLine, range.endCharacter);

    const edits: Replacement[] = [];
    let offset = 0;
    Array.from(text).forEach((char) => {
      const inRange = offset >= startOffset && offset < endOffset;
      if (inRange && BMP_CODE_UNIT_LENGTH === char.length) {
        const entity = this.entityMap.get(char);
        if (undefined !== entity) {
          edits.push(new Replacement(offset, char.length, char, entity));
        }
      }
      offset += char.length;
    });

    return new ReplacementResult(Object.freeze(edits));
  }
}
