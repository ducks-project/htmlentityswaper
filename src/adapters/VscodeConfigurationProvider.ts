/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
// Scaffold stub (FEAT-002): the method body is not implemented yet, so the
// `vscode` import and section constants are staged but unused and the method
// does not reference `this`. Remove this directive once the logic lands.

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
   * @returns A read-only record of character -> HTML entity overrides.
   */
  public getOverrides(): Readonly<Record<string, string>> {
    // TODO: read workspace.getConfiguration(CONFIGURATION_SECTION).get(OVERRIDES_KEY).
    throw new Error('Not implemented');
  }
}
