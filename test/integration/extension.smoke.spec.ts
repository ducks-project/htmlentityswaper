import { expect } from 'chai';
import * as vscode from 'vscode';

import { registerHostAgnosticAssertions } from './shared/host-agnostic-assertions';

/**
 * Fully-qualified identifier of the extension under test, as declared in
 * `package.json` (`publisher.name`).
 */
const EXTENSION_ID = 'ducks-project.htmlentityswaper';

/**
 * Whether the suite runs under continuous integration. When true, a missing
 * extension/display must FAIL explicitly instead of being skipped, so a broken
 * CI environment can never let the integration suite pass silently.
 */
const isCi = 'true' === process.env.CI;

/**
 * Node-based extension host entry point (`@vscode/test-electron`).
 *
 * It owns the host-specific bootstrap — activation in the `before` hook and the
 * CI-aware missing-extension policy — then delegates the host-agnostic
 * behavioural assertions (command registration, document/selection replacement,
 * the no-op information messages, the single-undo grouped edit) to the shared
 * module so the Web_Extension_Host harness (task 10.2) can reuse them unchanged.
 *
 * Missing-extension handling depends on the environment: locally (outside CI) the
 * suite stays tolerant and skips when no display/editor is available, so a
 * developer without a headless display is not blocked. Under CI (`CI === 'true'`,
 * run through `xvfb-run`) a missing extension is a hard FAILURE instead of a skip,
 * so a broken CI environment can never let the integration suite pass silently.
 */
describe('Extension integration (Node host)', () => {
  before(async function activateExtension() {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    if (undefined === extension) {
      if (isCi) {
        throw new Error(
          'Extension not loaded under CI; a display/editor is required and must not be skipped.',
        );
      }
      this.skip();
      return;
    }
    await extension.activate();
  });

  it('reports the extension as active after bootstrap', () => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    expect(extension?.isActive).to.equal(true);
  });

  registerHostAgnosticAssertions();
});
