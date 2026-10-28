import { expect } from 'chai';

import { EntityMap } from '../../src/core/EntityMap';

/**
 * Behaviour specification for {@link EntityMap} (skeleton).
 *
 * The class is still a scaffold stub (every method throws "Not implemented"),
 * so these cases are declared with `it.skip` and only describe the intended
 * contract. Unskip and flesh them out when the lookup logic lands.
 */
describe('EntityMap', () => {
  it.skip('exposes the number of entries through `size`', () => {
    // TODO: const map = new EntityMap(new Map([['à', '&agrave;']]));
    // TODO: expect(map.size).to.equal(1);
    expect(EntityMap).to.be.a('function');
  });

  it.skip('returns true from has() for a mapped character (O(1) lookup)', () => {
    // TODO: const map = new EntityMap(new Map([['à', '&agrave;']]));
    // TODO: expect(map.has('à')).to.equal(true);
  });

  it.skip('returns false from has() for an unmapped character', () => {
    // TODO: const map = new EntityMap(new Map([['à', '&agrave;']]));
    // TODO: expect(map.has('z')).to.equal(false);
  });

  it.skip('returns the mapped entity from get() for a mapped character', () => {
    // TODO: const map = new EntityMap(new Map([['à', '&agrave;']]));
    // TODO: expect(map.get('à')).to.equal('&agrave;');
  });

  it.skip('returns undefined from get() for an unmapped character', () => {
    // TODO: const map = new EntityMap(new Map([['à', '&agrave;']]));
    // TODO: expect(map.get('z')).to.equal(undefined);
  });
});
