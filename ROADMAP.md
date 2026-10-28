# Roadmap

This document describes the planned releases of HTML Entity Swapper. The dates are not
fixed; the order of the milestones is. The details evolve with the project.

## v0.1.0 — MVP

- Both commands operational: replacement across the document and within the selection.
- Default entity map, deduplicated and corrected.
- User overrides `htmlentityswaper.overrides` (add, replace, disable).
- Grouped edit with a single undo step, and configuration changes picked up immediately.
- Unit, property-based, and integration test suites in place.

## v0.2.0 — Portability and measurement

- Full web extension (browser target of the bundle), validated in a web host.
- Published mitata benchmarks, tracked in the documentation.
- Hardened test coverage across the core and the adapters.
- ESM migration and modern module resolution: move ts-node, the
  `@vscode/test-electron` harness, and the esbuild output to a coherent ESM
  setup so `moduleResolution` can leave the deprecated `node` (node10) mode
  before TypeScript 7.0 removes it. This is a dedicated effort because the
  project is currently CommonJS end-to-end.

## v0.3.0 — Feature enrichment

- Configurable choice between numeric entities and named entities.
- Reverse command: HTML entity to character.
- Support for multiple selections.
- Internationalization of the interface labels.
