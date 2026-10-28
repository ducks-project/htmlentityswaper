import { expect } from 'chai';

import { DEFAULT_ENTITIES } from '../../src/data/default-entities';

/**
 * Exact number of entries expected in the deduplicated default table.
 *
 * Frozen here so that any accidental duplicate key (which a `Map` would
 * silently collapse) or any dropped/added pair breaks this test instead of
 * shipping unnoticed.
 */
const EXPECTED_ENTITY_COUNT = 203;

describe('DEFAULT_ENTITIES', () => {
  it('exposes the exact expected number of unique entries', () => {
    expect(DEFAULT_ENTITIES.size).to.equal(EXPECTED_ENTITY_COUNT);
  });

  it('contains no duplicate key (Map size matches declared pair count)', () => {
    // A duplicate key in the source tuple array would collapse in the `Map`,
    // making `size` smaller than the number of declared pairs. The source is
    // authored as a tuple array precisely so the count stays auditable; this
    // assertion pins the deduplicated size.
    const keys = [...DEFAULT_ENTITIES.keys()];
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).to.equal(DEFAULT_ENTITIES.size);
  });

  it('never maps the double-quote character by default', () => {
    expect(DEFAULT_ENTITIES.has('"')).to.equal(false);
  });

  it('maps dotless small i and dotted capital I to distinct corrected values', () => {
    // Correction versus the reference table: U+0131 (ı) and U+0130 (İ) must be
    // two distinct keys with their own numeric references.
    expect(DEFAULT_ENTITIES.get('ı')).to.equal('&#305;');
    expect(DEFAULT_ENTITIES.get('İ')).to.equal('&#304;');
    expect(DEFAULT_ENTITIES.get('ı')).to.not.equal(DEFAULT_ENTITIES.get('İ'));
  });

  it('maps a-macron to its numeric reference, not the a-umlaut entity', () => {
    // Correction versus the reference table: `ā` (U+0101) was wrongly mapped to
    // `&auml;`; it must resolve to its own numeric reference.
    expect(DEFAULT_ENTITIES.get('ā')).to.equal('&#257;');
    expect(DEFAULT_ENTITIES.get('ä')).to.equal('&auml;');
  });
});
