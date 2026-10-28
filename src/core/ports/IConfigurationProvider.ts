/**
 * Port (Dependency Inversion) exposing the user-defined override table to the
 * core without binding it to any configuration backend.
 *
 * The core depends on this abstraction only; a concrete adapter (for example
 * `VscodeConfigurationProvider`) reads the real settings. `EntityMapBuilder`
 * consumes the returned record through {@link IConfigurationProvider.getOverrides}
 * to add, replace, or disable entries in the default entity table.
 */
export interface IConfigurationProvider {
  /**
   * Return the current override table as an immutable character -> entity map.
   *
   * Semantics interpreted by `EntityMapBuilder`:
   * - a key absent from the defaults adds a new entry;
   * - a key present in the defaults overwrites it;
   * - an empty value disables (removes) the matching default entry.
   * @returns A read-only record of character -> HTML entity overrides.
   */
  getOverrides(): Readonly<Record<string, string>>;
}
