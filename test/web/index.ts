// Web_Extension_Host entry point (`@vscode/test-web`).
//
// `@vscode/test-web` loads the module referenced by `--extensionTestsPath`
// inside the Browser Web Worker that hosts the web extension, then calls its
// exported `run()` function. Unlike the Node host (`@vscode/test-electron`,
// `test/integration/index.ts`) there is no Node runtime here: the suite runs in
// a Web Worker, so this module and everything it pulls in must stay free of
// Node-only built-ins (`fs`, `path`, `os`, ...). It therefore drives Mocha
// through its browser build and talks to the editor exclusively through the
// `vscode` module API.
//
// The host-agnostic behavioural assertions are shared verbatim with the Node
// host via `registerHostAgnosticAssertions`; only the host-specific bootstrap
// (activating the extension by id, the Mocha browser wiring) lives here.

// Mocha's browser build installs a global `mocha` object and the BDD globals
// (`describe`, `it`, `before`) once evaluated. It is a pre-bundled browser
// artifact, so importing it for its side effect is the supported way to obtain
// Mocha inside a Web Worker.
import 'mocha/mocha';

import { expect } from 'chai';
import * as vscode from 'vscode';

import { registerHostAgnosticAssertions } from '../integration/shared/host-agnostic-assertions';

/**
 * Fully-qualified identifier of the extension under test, as declared in
 * `package.json` (`publisher.name`). Matches the Node host entry point so both
 * hosts activate the same extension.
 */
const EXTENSION_ID = 'ducks-project.htmlentityswaper';

/** Mocha user interface used by the web suite (same BDD style as the Node host). */
const MOCHA_UI = 'bdd';

/** Per-test timeout in milliseconds for the web suite. */
const MOCHA_TIMEOUT_MS = 20000;

/**
 * Entry point invoked by `@vscode/test-web` inside the Web Worker that hosts the
 * web extension. It configures Mocha's browser build, registers the shared
 * host-agnostic assertions under a web-specific `describe` block whose `before`
 * hook activates the extension by id, runs the suite, and resolves or rejects
 * depending on the number of failures.
 *
 * @returns A promise that resolves when the suite passes and rejects on any
 *   failing test or run error.
 */
export function run(): Promise<void> {
  // `mocha` is the global installed by the `mocha/mocha` browser build above.
  mocha.setup({ ui: MOCHA_UI, timeout: MOCHA_TIMEOUT_MS, reporter: undefined });

  describe('Extension integration (Web host)', () => {
    before(async () => {
      const extension = vscode.extensions.getExtension(EXTENSION_ID);
      if (undefined === extension) {
        // Under the web host the extension is always provided through
        // `--extensionDevelopmentPath`, so a missing extension is a hard failure
        // rather than a skip: it means the harness is misconfigured.
        throw new Error(
          `Extension "${EXTENSION_ID}" not loaded under the web host; ` +
            'check --extensionDevelopmentPath and the browser bundle.',
        );
      }
      await extension.activate();
    });

    it('reports the extension as active after bootstrap', () => {
      const extension = vscode.extensions.getExtension(EXTENSION_ID);
      expect(extension?.isActive).to.equal(true);
    });

    registerHostAgnosticAssertions();
  });

  return new Promise<void>((resolve, reject) => {
    try {
      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} web integration test(s) failed.`));
          return;
        }
        resolve();
      });
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}
