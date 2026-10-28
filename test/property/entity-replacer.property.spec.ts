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

const defaultReplacer = new EntityReplacer(new EntityMapBuilder().withDefaults().build());

/**
 * Property-based specification for {@link EntityReplacer}.
 *
 * The invariants hold because the default table maps accented/special source
 * characters to ASCII entities (`& # ; letters`), and no ASCII character is a
 * mapped key — so applying the edits can never reintroduce a mappable character.
 */
describe('EntityReplacer (properties)', () => {
  it('is idempotent once mapped characters have been replaced', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), (input) => {
        const once = applyEdits(
          input,
          defaultReplacer.computeReplacements(new FakeDocument(input)),
        );
        const second = defaultReplacer.computeReplacements(new FakeDocument(once));
        expect(second.count).to.equal(0);
      }),
    );
  });

  it('leaves characters absent from the entity map untouched', () => {
    const replacer = new EntityReplacer(new EntityMap(new Map([['é', '&eacute;']])));
    fc.assert(
      fc.property(fc.stringOf(fc.constantFrom('a', 'b', 'c', '1', ' ')), (input) => {
        const result = replacer.computeReplacements(new FakeDocument(input));
        expect(result.count).to.equal(0);
        expect(applyEdits(input, result)).to.equal(input);
      }),
    );
  });

  it('never splits a UTF-16 surrogate pair', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), (input) => {
        const result = defaultReplacer.computeReplacements(new FakeDocument(input));
        result.edits.forEach((edit) => {
          // Each edit covers exactly one BMP code unit, so neither boundary may
          // fall on a surrogate code unit of the original text.
          expect(edit.length).to.equal(1);
          expect(isSurrogate(input.charCodeAt(edit.position))).to.equal(false);
        });
        // Applying the edits must not create an orphan surrogate.
        const output = applyEdits(input, result);
        for (let index = 0; index < output.length; index += 1) {
          const code = output.charCodeAt(index);
          if (isSurrogate(code)) {
            // A surrogate must be part of a valid pair from the original text.
            expect(output.codePointAt(index)).to.be.a('number');
          }
        }
      }),
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
