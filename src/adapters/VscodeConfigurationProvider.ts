import * as vscode from 'vscode';
import type { IConfigurationProvider } from '../core/ports/IConfigurationProvider';

/** Configuration section owning the override table. */
const CONFIGURATION_SECTION = 'htmlentityswaper';
/** Configuration key holding the character -> entity overrides. */
const OVERRIDES_KEY = 'overrides';

/**
 * Adapter implementing {@link IConfigurationProvider} on top of the VS Code
 * settings API.
 *
 * It is the only knowledge the core has of where overrides come from; the core
 * itself never imports `vscode`. Reads `htmlentityswaper.overrides` on demand so
 * configuration changes take effect without a window reload.
 */
export class VscodeConfigurationProvider implements IConfigurationProvider {
  /**
   * Read the current override table from VS Code settings.
   *
   * Only plain `string -> string` entries are kept; any non-string value is
   * ignored defensively. Settings are treated as inert data: nothing is ever
   * evaluated and no network access is performed.
   * @returns A read-only record of character -> HTML entity overrides, empty
   *   when the setting is absent or not an object.
   */
  // This method implements an instance contract but reads only global VS Code
  // settings, so it legitimately does not reference `this`.
  // eslint-disable-next-line class-methods-use-this
  public getOverrides(): Readonly<Record<string, string>> {
    const raw: unknown = vscode.workspace
      .getConfiguration(CONFIGURATION_SECTION)
      .get<unknown>(OVERRIDES_KEY);

    if (raw === null || typeof raw !== 'object') {
      return {};
    }

    const overrides: Record<string, string> = {};
    Object.entries(raw as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === 'string') {
        overrides[key] = value;
      }
    });
    return overrides;
  }
}
