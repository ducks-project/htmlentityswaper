import { expect } from 'chai';

import { EntityMapBuilder } from '../../src/core/EntityMapBuilder';

/**
 * Behaviour specification for {@link EntityMapBuilder} (skeleton).
 *
 * The builder is still a scaffold stub (every method throws "Not implemented"),
 * so these cases are declared with `it.skip` and only describe the intended
 * contract. Unskip and flesh them out when the builder logic lands.
 */
describe('EntityMapBuilder', () => {
  it.skip('seeds the map with the bundled defaults via withDefaults()', () => {
    // TODO: const map = new EntityMapBuilder().withDefaults().build();
    // TODO: expect(map.has('à')).to.equal(true);
    expect(EntityMapBuilder).to.be.a('function');
  });

  it.skip('returns this from each mutator to allow fluent chaining', () => {
    // TODO: const builder = new EntityMapBuilder();
    // TODO: expect(builder.withDefaults()).to.equal(builder);
    // TODO: expect(builder.withOverrides({})).to.equal(builder);
  });

  it.skip('adds a new mapping when the override key is absent from defaults', () => {
    // TODO: const map = new EntityMapBuilder().withDefaults()
    // TODO:   .withOverrides({ '\u2605': '&#9733;' }).build();
    // TODO: expect(map.get('\u2605')).to.equal('&#9733;');
  });

  it.skip('overwrites an existing mapping when the override key already exists', () => {
    // TODO: const map = new EntityMapBuilder().withDefaults()
    // TODO:   .withOverrides({ 'à': '&#224;' }).build();
    // TODO: expect(map.get('à')).to.equal('&#224;');
  });

  it.skip('disables a mapping when override key equals its value', () => {
    // TODO: const map = new EntityMapBuilder().withDefaults()
    // TODO:   .withOverrides({ 'à': 'à' }).build();
    // TODO: expect(map.has('à')).to.equal(false);
  });
});
