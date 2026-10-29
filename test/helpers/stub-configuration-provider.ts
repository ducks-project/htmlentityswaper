import type { IConfigurationProvider } from '../../src/core/ports/IConfigurationProvider';

/**
 * Test double conforming to the full {@link IConfigurationProvider} contract.
 *
 * It returns the override table it currently holds, which a test can mutate via
 * {@link setOverrides} between invocations to assert that the controller rebuilds
 * the entity map on every command (next-invocation override pickup), without a
 * real `vscode` settings backend.
 */
export class StubConfigurationProvider implements IConfigurationProvider {
  private overrides: Readonly<Record<string, string>>;

  /**
   * Build the provider from the overrides it should report.
   * @param overrides Initial override table; empty when omitted.
   */
  public constructor(overrides: Readonly<Record<string, string>> = {}) {
    this.overrides = overrides;
  }

  /**
   * Return the current override table.
   * @returns The read-only override record the provider currently holds.
   */
  public getOverrides(): Readonly<Record<string, string>> {
    return this.overrides;
  }

  /**
   * Replace the override table reported on the next call.
   * @param overrides The new override table.
   */
  public setOverrides(overrides: Readonly<Record<string, string>>): void {
    this.overrides = overrides;
  }
}
