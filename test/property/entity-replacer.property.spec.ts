import { expect } from 'chai';
import * as fc from 'fast-check';

import { EntityReplacer } from '../../src/core/EntityReplacer';

/**
 * Property-based specification for {@link EntityReplacer} (skeleton).
 *
 * The replacer is still a scaffold stub, so each property is declared with
 * `it.skip` and only documents the invariant it must eventually enforce.
 * `fast-check` is imported now so the harness compiles and so unskipping a
 * property is the only change needed later.
 */
describe('EntityReplacer (properties)', () => {
  it.skip('is idempotent once mapped characters have been replaced', () => {
    // TODO: for any input string, applying the replacements once yields a text
    // TODO: whose subsequent run produces no further replacement (count === 0).
    // TODO: fc.assert(fc.property(fc.string(), (input) => { ... }));
    // References kept so the imports are exercised until the body lands.
    fc.pre(true);
    expect(EntityReplacer).to.be.a('function');
  });

  it.skip('leaves characters absent from the entity map untouched', () => {
    // TODO: for any string built only from unmapped characters, the result is
    // TODO: empty (no edit) and the text is returned verbatim.
  });

  it.skip('never splits a UTF-16 surrogate pair', () => {
    // TODO: for any string containing astral-plane code points, no Replacement
    // TODO: starts or ends in the middle of a surrogate pair.
    // TODO: fc.assert(fc.property(fc.fullUnicodeString(), (input) => { ... }));
  });
});
