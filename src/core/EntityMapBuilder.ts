/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
// Scaffold stub (FEAT-002): method bodies are not implemented yet, so parameters
// are unused and methods do not reference `this`. These lint rules are disabled
// at file scope until the logic lands; remove this directive once implemented.

import { EntityMap } from './EntityMap';

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
 * - an entry whose key equals its value disables (removes) the mapping, which
 *   lets a user turn a default replacement off from configuration.
 */
export class EntityMapBuilder {
  private readonly entries: Map<string, string> = new Map<string, string>();

  /**
   * Seed the builder with the bundled default entity table.
   * @returns This builder, for chaining.
   */
  public withDefaults(): this {
    // TODO: implemented in a later feature.
    throw new Error('Not implemented');
  }

  /**
   * Merge user-provided overrides into the current entries.
   * @param overrides Read-only character -> entity overrides to apply.
   * @returns This builder, for chaining.
   */
  public withOverrides(overrides: Readonly<Record<string, string>>): this {
    // TODO: implemented in a later feature.
    throw new Error('Not implemented');
  }

  /**
   * Freeze the accumulated entries into an immutable entity map.
   * @returns A new {@link EntityMap} reflecting defaults and overrides.
   */
  public build(): EntityMap {
    // TODO: implemented in a later feature.
    throw new Error('Not implemented');
  }
}
