import * as path from 'path';
import { fileURLToPath } from 'node:url';

import { runTests } from '@vscode/test-electron';

// ESM-safe equivalent of the CommonJS `__dirname`: under ES modules there is no
// `__dirname` binding, so the current file's directory is derived from
// `import.meta.url`. This keeps the resolved paths below byte-for-byte identical
// to the previous `__dirname`-based resolution.
const currentDir = path.dirname(fileURLToPath(import.meta.url));

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
    const extensionDevelopmentPath = path.resolve(currentDir, '..');
    // The compiled test runner that programmatically drives Mocha. The VS Code
    // extension host loads this entry point as a plain CommonJS module (no
    // ts-node), so it must point at the JavaScript emitted by `tsconfig.test.json`
    // into `out/`, not at the TypeScript source.
    const extensionTestsPath = path.resolve(extensionDevelopmentPath, 'out/test/integration/index');

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
