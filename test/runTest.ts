import * as path from 'path';

import { runTests } from '@vscode/test-electron';

/**
 * Entry point launching the VS Code integration test suite under a headless
 * editor instance (`@vscode/test-electron`). In CI this process is wrapped in
 * `xvfb-run` to provide a virtual display.
 *
 * It downloads (or reuses) a VS Code build, installs the extension from the
 * repository root, and runs the Mocha suite exported by `integration/index`.
 */
async function main(): Promise<void> {
  try {
    // The folder containing the extension manifest (package.json).
    const extensionDevelopmentPath = path.resolve(__dirname, '..');
    // The compiled test runner that programmatically drives Mocha.
    const extensionTestsPath = path.resolve(__dirname, './integration/index');

    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to run integration tests', error);
    process.exit(1);
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected failure while launching integration tests', error);
  process.exit(1);
});
