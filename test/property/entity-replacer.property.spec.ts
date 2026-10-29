import { expect } from 'chai';
import * as fc from 'fast-check';

import { EntityReplacer } from '../../src/core/EntityReplacer';
import { EntityMap } from '../../src/core/EntityMap';
import { EntityMapBuilder } from '../../src/core/EntityMapBuilder';
import type { ReplacementResult } from '../../src/core/models/ReplacementResult';
import { FakeDocument } from '../helpers/fake-document';

/** First UTF-16 code unit of the high-surrogate range (inclusive). */
const HIGH_SURROGATE_START = 0xd800;
/** Last UTF-16 code unit of the low-surrogate range (inclusive). */
const LOW_SURROGATE_END = 0xdfff;

/**
 * Apply a replacement result to its source text, from last edit to first so an
 * earlier replacement never shifts the offset of a later one.
 * @param source Original text the result was computed from.
 * @param result The replacements to apply.
 * @returns The text with every replacement applied.
 */
function applyEdits(source: string, result: ReplacementResult): string {
  const ordered = [...result.edits].sort((left, right) => right.position - left.position);
  return ordered.reduce((text, edit) => {
    const before = text.slice(0, edit.position);
    const after = text.slice(edit.position + edit.length);
    return `${before}${edit.replacement}${after}`;
  }, source);
}

/**
 * Test whether a code unit at a given index is one half of a surrogate pair.
 * @param code UTF-16 code unit value.
 * @returns `true` when the code unit is a surrogate.
 */
function isSurrogate(code: number): boolean {
  return code >= HIGH_SURROGATE_START && code <= LOW_SURROGATE_END;
}

/**
 * Remove a set of `[offset, length]` UTF-16 spans from `text`, keeping the
 * surviving characters in their original relative order.
 * @param text Source string to carve spans out of.
 * @param spans Non-overlapping `[offset, length]` spans to drop, any order.
 * @returns The concatenation of the text runs that lie outside every span.
 */
function removeSpans(text: string, spans: ReadonlyArray<readonly [number, number]>): string {
  const ordered = [...spans].sort(([leftStart], [rightStart]) => leftStart - rightStart);
  let cursor = 0;
  let kept = '';
  ordered.forEach(([start, length]) => {
    kept += text.slice(cursor, start);
    cursor = start + length;
  });
  return `${kept}${text.slice(cursor)}`;
}

const defaultReplacer = new EntityReplacer(new EntityMapBuilder().withDefaults().build());

/**
 * Property-based specification for {@link EntityReplacer}.
 *
 * The invariants hold because the default table maps accented/special source
 * characters to ASCII entities (`& # ; letters`), and no ASCII character is a
 * mapped key — so applying the edits can never reintroduce a mappable character.
 */
describe('EntityReplacer (properties)', () => {
  // Feature: v0-2-0-portability-and-measurement, Property 1: Replacement is idempotent
  // Validates: Requirements 4.5
  it('is idempotent: applying the replacement twice equals applying it once', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), (input) => {
        const once = applyEdits(
          input,
          defaultReplacer.computeReplacements(new FakeDocument(input)),
        );
        // A second pass over the already-replaced text must produce no further
        // edits, so applying twice yields the exact same text as applying once.
        const secondResult = defaultReplacer.computeReplacements(new FakeDocument(once));
        const twice = applyEdits(once, secondResult);
        expect(secondResult.count).to.equal(0);
        expect(twice).to.equal(once);
      }),
      { numRuns: 100 },
    );
  });

  it('Feature: v0-2-0-portability-and-measurement, Property 2: Unmapped characters are preserved in order', () => {
    const activeMap = new Map([
      ['é', '&eacute;'],
      ['à', '&agrave;'],
      ['&', '&amp;'],
    ]);
    const replacer = new EntityReplacer(new EntityMap(activeMap));
    // Mix mapped keys with characters guaranteed absent from the map so the
    // relative-order claim about unmapped code points is actually exercised.
    const unmapped = ['a', 'b', 'c', '1', ' ', 'z'];
    const char = fc.constantFrom(...unmapped, ...activeMap.keys());
    fc.assert(
      fc.property(
        fc.array(char).map((chars) => chars.join('')),
        (input) => {
          const result = replacer.computeReplacements(new FakeDocument(input));
          const output = applyEdits(input, result);
          const edits = [...result.edits].sort((left, right) => left.position - right.position);

          // The engine touches only mapped code points, so removing every replaced
          // span from the input yields exactly the unmapped code points, in their
          // original relative order.
          const expectedUnmapped = removeSpans(
            input,
            edits.map((edit) => [edit.position, edit.length]),
          );

          // Removing every injected entity from the output must recover the very
          // same subsequence: unmapped code points are copied verbatim, unchanged
          // and in order, between the entities. `delta` tracks how far the output
          // offset has drifted from the input offset as earlier entities widen it.
          let delta = 0;
          const outputSpans: ReadonlyArray<[number, number]> = edits.map((edit) => {
            const span: [number, number] = [edit.position + delta, edit.replacement.length];
            delta += edit.replacement.length - edit.length;
            return span;
          });
          const preservedUnmapped = removeSpans(output, outputSpans);

          expect(preservedUnmapped).to.equal(expectedUnmapped);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: v0-2-0-portability-and-measurement, Property 3: Surrogate pairs are never split
  // Validates: Requirements 4.7
  it('never splits a UTF-16 surrogate pair', () => {
    // Smallest supplementary-plane code point: the start of the astral range.
    const ASTRAL_RANGE_START = 0x10000;
    // Largest valid Unicode code point (end of plane 16).
    const ASTRAL_RANGE_END = 0x10ffff;
    // A generator guaranteed to emit supplementary-plane (astral) characters so
    // the surrogate-pair invariant is exercised meaningfully. We interleave
    // explicit astral code points with BMP and mapped ASCII characters.
    const astralChar = fc
      .integer({ min: ASTRAL_RANGE_START, max: ASTRAL_RANGE_END })
      .map((codePoint) => String.fromCodePoint(codePoint));
    const mixedChar = fc.oneof(astralChar, fc.fullUnicode());
    // At least one astral character is prepended so every generated input truly
    // contains a surrogate pair; the random body then mixes further code points.
    const astralInput = fc
      .tuple(astralChar, fc.array(mixedChar, { minLength: 0, maxLength: 64 }))
      .map(([lead, rest]) => `${lead}${rest.join('')}`);

    fc.assert(
      fc.property(astralInput, (input) => {
        const result = defaultReplacer.computeReplacements(new FakeDocument(input));
        result.edits.forEach((edit) => {
          // Each edit covers exactly one BMP code unit, so neither boundary may
          // fall on a surrogate code unit of the original text.
          expect(edit.length).to.equal(1);
          expect(isSurrogate(input.charCodeAt(edit.position))).to.equal(false);
        });
        // Applying the edits must not leave an orphan surrogate: every surrogate
        // code unit in the output must still be one half of a valid pair.
        const output = applyEdits(input, result);
        for (let index = 0; index < output.length; index += 1) {
          const code = output.charCodeAt(index);
          if (isSurrogate(code)) {
            const codePoint = output.codePointAt(index) ?? code;
            // A paired surrogate decodes to a supplementary-plane code point; an
            // unpaired (orphan) surrogate decodes back to the surrogate itself.
            expect(isSurrogate(codePoint)).to.equal(false);
            // Skip the trailing low surrogate already consumed by the pair.
            index += 1;
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('keeps position/length consistent with the original substring', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), (input) => {
        const result = defaultReplacer.computeReplacements(new FakeDocument(input));
        result.edits.forEach((edit) => {
          expect(input.slice(edit.position, edit.position + edit.length)).to.equal(edit.original);
        });
      }),
    );
  });
});
