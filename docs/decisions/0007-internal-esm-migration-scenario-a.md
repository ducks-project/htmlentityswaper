# ADR 0007 — Internal ESM migration (Scenario A)

## Status

Accepted.

## Context

For the v0.2.0 milestone the TypeScript source is migrated to ECMAScript modules
(ESM): `import`/`export` only, no `require(...)` call and no `module.exports`/`exports.*`
assignment under `src/**`. Several migration scenarios are possible, from a full
package-level ESM switch (adding `"type": "module"` to `package.json`) down to a
source-only migration that leaves the emitted bundle format untouched.

A full package-level switch is heavier than this milestone needs. The extension is
bundled by esbuild ([esbuild.mjs](../../esbuild.mjs)) and ships two entry points
declared in `package.json`: a node target (primary `main`) and a browser target
(web extension `browser`). The VS Code host loads the node bundle as CommonJS, and
the integration tests run compiled CommonJS from `out/` under `@vscode/test-electron`.
Changing the package type or the compatibility range would ripple into all of those
consumers for no functional gain.

## Decision

The migration follows **Scenario A**: the source is ESM, while esbuild — not the
TypeScript `module` setting — controls the format of each emitted bundle.

Concretely:

- The root [tsconfig.json](../../tsconfig.json) sets `module` to `"esnext"` and
  `moduleResolution` to `"bundler"`. `tsc` is used only for type-checking
  (`npm run compile`, `noEmit: true`); it never emits the shipped artifacts.
- The source under `src/**` is ESM-only (`import`/`export`), verified by compilation
  and an ESLint rule forbidding CommonJS constructs.
- esbuild owns the emitted format independently of the TypeScript `module` setting:
  the node target stays CommonJS (`format: 'cjs'`) and the browser target is a Web
  Worker CommonJS bundle (`format: 'cjs'`, `platform: 'browser'`), both in
  [esbuild.mjs](../../esbuild.mjs). The browser target uses `format: 'cjs'` rather
  than `iife` because the Web Extension Host loads the `browser` entry as a
  CommonJS module and calls its exported `activate`; this matches the official VS
  Code web extension guidance (esbuild `format: 'cjs'` / webpack `libraryTarget:
'commonjs'`). A bare IIFE would keep the `activate`/`deactivate` bindings trapped
  in its closure, so the host could never activate the extension.
- No `"type": "module"` is added to `package.json`, and `main`, `browser`, and
  `engines.vscode` (`^1.85.0`) are left unchanged.

## Consequences

- The ESM source compiles clean with no `moduleResolution` deprecation diagnostic
  and no node10-removal diagnostic, while the shipped node bundle remains CommonJS
  for the VS Code host — the host loading contract is unchanged.
- Because esbuild controls the bundle format, the TypeScript `module` setting and the
  runtime bundle format are decoupled: the source can be ESM without forcing a
  package-level type switch or a compatibility-range change.
- **Accepted technical debt**: the deprecated node10 `moduleResolution` (`"node"`)
  survives, isolated in [tsconfig.test.json](../../tsconfig.test.json). That config
  locally overrides `module` to `"commonjs"` and `moduleResolution` to `"node"` so
  `out/` emits CommonJS for the `@vscode/test-electron` host, decoupled from the ESM
  root. This node10 resolution is scheduled for removal before TypeScript 7.0 drops
  node10 support; until then the debt is contained to the test config alone and does
  not reach `src/**` or the shipped bundles.
