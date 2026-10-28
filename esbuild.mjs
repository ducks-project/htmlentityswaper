// Build script for the extension. esbuild handles the bundling; tsc is used only
// for type-checking (`npm run compile`). Two targets are prepared: a node target
// (primary, main entry point) and a browser target (web extension, ROADMAP v0.2).
//
// Usage:
//   node esbuild.mjs            production node build
//   node esbuild.mjs --dev      development node build (sourcemaps, no minify)
//   node esbuild.mjs --prod     explicit production node build (minified)
//   node esbuild.mjs --watch    rebuild on change (node target)
//   node esbuild.mjs --browser  browser target (see TODO below)

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

// TODO(FEAT-002+): the browser (web extension) target is wired but unverified.
// It may require Node builtin polyfills/shims once the business logic lands.
// The node target stays the priority and the only one verified by the scaffold.
/**
 * Browser target options (web extension, prepared).
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

const options = isBrowser ? browserOptions : nodeOptions;

if (isWatch) {
  const context = await esbuild.context(options);
  await context.watch();
} else {
  await esbuild.build(options);
}
