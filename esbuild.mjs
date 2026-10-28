// Build script for the extension. esbuild handles the bundling; tsc is used only
// for type-checking (`npm run compile`). Two targets are produced: a node target
// (primary `main` entry point) and a browser target (web extension `browser`
// entry point). Both are declared in package.json, so both must exist for vsce
// to package the extension.
//
// Usage:
//   node esbuild.mjs            production build of BOTH targets (node + browser)
//   node esbuild.mjs --dev      development build of both targets (sourcemaps, no minify)
//   node esbuild.mjs --prod     explicit production build of both targets (minified)
//   node esbuild.mjs --watch    rebuild the node target on change
//   node esbuild.mjs --browser  build only the browser target

import * as esbuild from 'esbuild';

const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const isDev = args.includes('--dev');
const isBrowser = args.includes('--browser');
// Production unless an explicit dev/watch flag is passed.
const isProd = args.includes('--prod') || (!isDev && !isWatch);

/**
 * Base build options shared by every target. `vscode` is always external: it is
 * provided by the host at runtime and must never be bundled.
 * @type {import('esbuild').BuildOptions}
 */
const baseOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  external: ['vscode'],
  format: 'cjs',
  logLevel: 'info',
};

/**
 * Node target options (primary). Platform node, CommonJS, targets the VS Code
 * bundled Node runtime.
 * @type {import('esbuild').BuildOptions}
 */
const nodeOptions = {
  ...baseOptions,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/node/extension.js',
  sourcemap: !isProd,
  minify: isProd,
};

/**
 * Browser target options (web extension). The core is pure and imports no Node
 * builtin, so the browser bundle needs no polyfill/shim; `vscode` stays external.
 * @type {import('esbuild').BuildOptions}
 */
const browserOptions = {
  ...baseOptions,
  platform: 'browser',
  target: 'es2021',
  outfile: 'dist/browser/extension.js',
  sourcemap: !isProd,
  minify: isProd,
};

if (isWatch) {
  // Watch mode rebuilds only the node target for a fast dev loop.
  const context = await esbuild.context(nodeOptions);
  await context.watch();
} else if (isBrowser) {
  // Explicit single browser build.
  await esbuild.build(browserOptions);
} else {
  // Default/dev/prod: build BOTH declared entry points so the package is complete.
  await Promise.all([esbuild.build(nodeOptions), esbuild.build(browserOptions)]);
}
