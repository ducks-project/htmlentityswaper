import { EntityMap } from './EntityMap';
import { DEFAULT_ENTITIES } from '../data/default-entities';

/**
 * Builder (Fluent Interface) assembling an immutable {@link EntityMap} from the
 * default table and user overrides.
 *
 * Every mutator returns `this` to allow chaining
 * (`new EntityMapBuilder().withDefaults().withOverrides(o).build()`).
 *
 * Override semantics applied by {@link EntityMapBuilder.withOverrides}:
 * - a key absent from the current entries adds a new mapping;
 * - a key already present overwrites the existing mapping;
 * - an entry whose key equals its value, or whose value is empty, disables
 *   (removes) the mapping, which lets a user turn a default replacement off
 *   from configuration.
 */
export class EntityMapBuilder {
  private readonly entries: Map<string, string> = new Map<string, string>();

  /**
   * Seed the builder with the bundled default entity table.
   * @returns This builder, for chaining.
   */
  public withDefaults(): this {
    DEFAULT_ENTITIES.forEach((entity, char) => {
      this.entries.set(char, entity);
    });
    return this;
  }

  /**
   * Merge user-provided overrides into the current entries.
   *
   * The `overrides` argument is never mutated: entries are read and applied to
   * this builder's own private map.
   * @param overrides Read-only character -> entity overrides to apply.
   * @returns This builder, for chaining.
   */
  public withOverrides(overrides: Readonly<Record<string, string>>): this {
    Object.entries(overrides).forEach(([char, entity]) => {
      if (char === entity || '' === entity) {
        this.entries.delete(char);
        return;
      }
      this.entries.set(char, entity);
    });
    return this;
  }

  /**
   * Freeze the accumulated entries into an immutable entity map.
   *
   * A fresh copy of the entries is passed to the map so later mutation of this
   * builder cannot leak into an already-built {@link EntityMap}.
   * @returns A new {@link EntityMap} reflecting defaults and overrides.
   */
  public build(): EntityMap {
    return new EntityMap(new Map<string, string>(this.entries));
  }
}
