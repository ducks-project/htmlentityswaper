import { expect } from 'chai';

import { EntityReplacer } from '../../src/core/EntityReplacer';

/**
 * Behaviour specification for {@link EntityReplacer} (skeleton).
 *
 * The replacer is still a scaffold stub (computeReplacements throws
 * "Not implemented"), so these cases are declared with `it.skip` and only
 * describe the intended contract. Unskip and flesh them out when the
 * computation logic lands.
 */
describe('EntityReplacer', () => {
  it.skip('computes a replacement for every mapped character in the text', () => {
    // TODO: build an EntityMap with { 'à': '&agrave;' }, wrap a fake
    // TODO: ITextDocument whose text is "à", then assert the result holds a
    // TODO: single Replacement at offset 0 with original "à".
    expect(EntityReplacer).to.be.a('function');
  });

  it.skip('preserves characters that are not present in the entity map', () => {
    // TODO: with a document "abc" and a map without a/b/c, expect an empty
    // TODO: ReplacementResult (count === 0).
  });

  it.skip('restricts the scan to the provided range when one is given', () => {
    // TODO: pass an IReplacementRange covering only part of the document and
    // TODO: assert replacements outside the range are not reported.
  });
});
