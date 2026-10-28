import { expect } from 'chai';

import { EntityMap } from '../../src/core/EntityMap';

/**
 * Behaviour specification for {@link EntityMap}.
 *
 * The map wraps a `ReadonlyMap` and exposes only O(1) read accessors; it never
 * leaks a mutable reference to its backing entries.
 */
describe('EntityMap', () => {
  it('exposes the number of entries through `size`', () => {
    const map = new EntityMap(new Map([['à', '&agrave;']]));
    expect(map.size).to.equal(1);
  });

  it('returns true from has() for a mapped character (O(1) lookup)', () => {
    const map = new EntityMap(new Map([['à', '&agrave;']]));
    expect(map.has('à')).to.equal(true);
  });

  it('returns false from has() for an unmapped character', () => {
    const map = new EntityMap(new Map([['à', '&agrave;']]));
    expect(map.has('z')).to.equal(false);
  });

  it('returns the mapped entity from get() for a mapped character', () => {
    const map = new EntityMap(new Map([['à', '&agrave;']]));
    expect(map.get('à')).to.equal('&agrave;');
  });

  it('returns undefined from get() for an unmapped character', () => {
    const map = new EntityMap(new Map([['à', '&agrave;']]));
    expect(map.get('z')).to.equal(undefined);
  });

  it('does not expose a public mutator to change its entries', () => {
    const map = new EntityMap(new Map([['à', '&agrave;']]));
    expect((map as unknown as Record<string, unknown>).set).to.equal(undefined);
    expect((map as unknown as Record<string, unknown>).delete).to.equal(undefined);
  });
});
