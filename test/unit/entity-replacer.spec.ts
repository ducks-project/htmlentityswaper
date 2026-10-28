import { expect } from 'chai';

import { EntityReplacer } from '../../src/core/EntityReplacer';
import { EntityMap } from '../../src/core/EntityMap';
import { EntityMapBuilder } from '../../src/core/EntityMapBuilder';
import { FakeDocument } from '../helpers/fake-document';

/**
 * Build a replacer over a small hand-made entity map.
 * @param pairs Character -> entity pairs to seed the map with.
 * @returns A replacer bound to the built map.
 */
function replacerOf(pairs: ReadonlyArray<readonly [string, string]>): EntityReplacer {
  return new EntityReplacer(new EntityMap(new Map(pairs)));
}

/**
 * Behaviour specification for {@link EntityReplacer}.
 */
describe('EntityReplacer', () => {
  it('computes a single replacement for a mapped character at offset 0', () => {
    const result = replacerOf([['é', '&eacute;']]).computeReplacements(new FakeDocument('é'));
    expect(result.count).to.equal(1);
    const [edit] = result.edits;
    expect(edit.position).to.equal(0);
    expect(edit.length).to.equal(1);
    expect(edit.original).to.equal('é');
    expect(edit.replacement).to.equal('&eacute;');
  });

  it('computes a replacement for every mapped character on one line', () => {
    const replacer = replacerOf([
      ['é', '&eacute;'],
      ['à', '&agrave;'],
    ]);
    const result = replacer.computeReplacements(new FakeDocument('éxà'));
    expect(result.count).to.equal(2);
    expect(result.edits[0].position).to.equal(0);
    expect(result.edits[1].position).to.equal(2);
  });

  it('tracks offsets across several lines, line separators included', () => {
    const replacer = replacerOf([['é', '&eacute;']]);
    const result = replacer.computeReplacements(new FakeDocument('a\né'));
    expect(result.count).to.equal(1);
    expect(result.edits[0].position).to.equal(2);
  });

  it('preserves characters that are not present in the entity map', () => {
    const result = replacerOf([['é', '&eacute;']]).computeReplacements(new FakeDocument('abc'));
    expect(result.count).to.equal(0);
  });

  it('never replaces the double-quote character with the default table', () => {
    const replacer = new EntityReplacer(new EntityMapBuilder().withDefaults().build());
    const result = replacer.computeReplacements(new FakeDocument('"quote"'));
    expect(result.count).to.equal(0);
  });

  it('restricts the scan to the provided range when one is given', () => {
    const replacer = replacerOf([['é', '&eacute;']]);
    // Document "éaé": only the first line character [0,1) is inside the range.
    const result = replacer.computeReplacements(new FakeDocument('éaé'), {
      startLine: 0,
      startCharacter: 0,
      endLine: 0,
      endCharacter: 1,
    });
    expect(result.count).to.equal(1);
    expect(result.edits[0].position).to.equal(0);
  });

  it('leaves characters outside a multi-line range untouched', () => {
    const replacer = replacerOf([['é', '&eacute;']]);
    // "é\né\né": only the middle line is selected.
    const result = replacer.computeReplacements(new FakeDocument('é\né\né'), {
      startLine: 1,
      startCharacter: 0,
      endLine: 1,
      endCharacter: 1,
    });
    expect(result.count).to.equal(1);
    expect(result.edits[0].position).to.equal(2);
  });

  it('returns an immutable, frozen edits array', () => {
    const result = replacerOf([['é', '&eacute;']]).computeReplacements(new FakeDocument('é'));
    expect(Object.isFrozen(result.edits)).to.equal(true);
  });
});
