/**
 * Immutable lookup table mapping a source character to its HTML entity.
 *
 * Wraps a `ReadonlyMap<string, string>` to guarantee O(1) lookups and to forbid
 * any mutation after construction (Open/Closed). Instances are produced by
 * {@link EntityMapBuilder}; the core never imports `vscode`.
 */
export class EntityMap {
  private readonly entries: ReadonlyMap<string, string>;

  /**
   * Build an immutable entity map from a pre-computed read-only map.
   * @param entries Character -> HTML entity pairs, already deduplicated/merged.
   */
  public constructor(entries: ReadonlyMap<string, string>) {
    this.entries = entries;
  }

  /**
   * Number of entries in the map.
   */
  public get size(): number {
    return this.entries.size;
  }

  /**
   * Test whether a character has an entity mapping. O(1).
   * @param char The single source character to look up.
   * @returns `true` when a replacement exists for `char`.
   */
  public has(char: string): boolean {
    return this.entries.has(char);
  }

  /**
   * Return the HTML entity mapped to a character, if any. O(1).
   * @param char The single source character to look up.
   * @returns The HTML entity, or `undefined` when the character is not mapped.
   */
  public get(char: string): string | undefined {
    return this.entries.get(char);
  }
}
