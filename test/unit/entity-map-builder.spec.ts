import { expect } from 'chai';

import { EntityMapBuilder } from '../../src/core/EntityMapBuilder';

/** Number of entries in the bundled default entity table. */
const EXPECTED_DEFAULT_COUNT = 203;

/**
 * Behaviour specification for {@link EntityMapBuilder}.
 *
 * Covers the fluent interface, the defaults load, and the add / overwrite /
 * disable override semantics.
 */
describe('EntityMapBuilder', () => {
  it('seeds the map with the bundled defaults via withDefaults()', () => {
    const map = new EntityMapBuilder().withDefaults().build();
    expect(map.has('à')).to.equal(true);
  });

  it('loads exactly the deduplicated default entity count', () => {
    const map = new EntityMapBuilder().withDefaults().build();
    expect(map.size).to.equal(EXPECTED_DEFAULT_COUNT);
  });

  it('returns this from each mutator to allow fluent chaining', () => {
    const builder = new EntityMapBuilder();
    expect(builder.withDefaults()).to.equal(builder);
    expect(builder.withOverrides({})).to.equal(builder);
  });

  it('adds a new mapping when the override key is absent from defaults', () => {
    const map = new EntityMapBuilder()
      .withDefaults()
      .withOverrides({ '\u2605': '&#9733;' })
      .build();
    expect(map.get('\u2605')).to.equal('&#9733;');
  });

  it('overwrites an existing mapping when the override key already exists', () => {
    const map = new EntityMapBuilder().withDefaults().withOverrides({ à: '&#224;' }).build();
    expect(map.get('à')).to.equal('&#224;');
  });

  it('disables a mapping when override key equals its value', () => {
    const map = new EntityMapBuilder().withDefaults().withOverrides({ à: 'à' }).build();
    expect(map.has('à')).to.equal(false);
  });

  it('disables a mapping when the override value is empty', () => {
    const map = new EntityMapBuilder().withDefaults().withOverrides({ à: '' }).build();
    expect(map.has('à')).to.equal(false);
  });

  it('does not mutate the overrides argument', () => {
    const overrides = Object.freeze({ '\u2605': '&#9733;' });
    expect(() =>
      new EntityMapBuilder().withDefaults().withOverrides(overrides).build(),
    ).to.not.throw();
  });

  it('builds independent maps that do not share later builder mutations', () => {
    const builder = new EntityMapBuilder().withDefaults();
    const first = builder.build();
    builder.withOverrides({ à: 'à' });
    const second = builder.build();
    expect(first.has('à')).to.equal(true);
    expect(second.has('à')).to.equal(false);
  });
});
