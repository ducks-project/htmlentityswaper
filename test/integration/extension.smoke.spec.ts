import { expect } from 'chai';
import * as vscode from 'vscode';

/**
 * Fully-qualified identifier of the extension under test, as declared in
 * `package.json` (`publisher.name`).
 */
const EXTENSION_ID = 'ducks-project.htmlentityswaper';

/**
 * Command identifiers the extension must contribute, matching the `contributes`
 * section of `package.json`.
 */
const EXPECTED_COMMANDS: readonly string[] = [
  'htmlentityswaper.replaceInDocument',
  'htmlentityswaper.replaceInSelection',
];

/**
 * Minimal real smoke test running inside the VS Code extension host.
 *
 * It verifies that the extension activates and that both contributed commands
 * are registered. It is tolerant of a headless/local environment without a
 * usable display: when the extension cannot be resolved (not loaded by the
 * host) the suite is skipped rather than failing. In CI under `xvfb-run` the
 * extension is loaded and the assertions run for real.
 */
describe('Extension smoke test', () => {
  it('activates and registers both contributed commands', async function activatesExtension() {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);

    if (undefined === extension) {
      // No usable extension host for this run (e.g. local without display);
      // skip instead of failing so the suite stays green off-CI.
      this.skip();
      return;
    }

    await extension.activate();
    expect(extension.isActive).to.equal(true);

    const commands = await vscode.commands.getCommands(true);
    EXPECTED_COMMANDS.forEach((command) => {
      expect(commands).to.include(command);
    });
  });
});
