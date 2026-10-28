# Roadmap

This document describes the planned releases of HTML Entity Swapper. The dates are not
fixed; the order of the milestones is. The details evolve with the project.

Each milestone title carries a status marker: `[Planned]` (not started) or
`[In progress]` (work underway). A milestone is removed from this document once it ships;
its shipped content then lives in the [CHANGELOG](CHANGELOG.md), which is the single source
of truth for what has been released. Items use GitHub task lists: `- [ ]` (not done) and
`- [x]` (done).

## v0.2.0 — Portability and measurement [In progress]

- [ ] Validate the web extension in a web host (`@vscode/test-web`). The browser bundle
      target already exists; this item covers the web-host validation only.
- [ ] Publish the mitata benchmarks and track them in the documentation. The benchmark
      itself already exists; this item covers publication and tracking only.
- [ ] Harden test coverage across the core and the adapters.
- [ ] ESM migration and modern module resolution: move ts-node, the
      `@vscode/test-electron` harness, and the esbuild output to a coherent ESM
      setup so `moduleResolution` can leave the deprecated `node` (node10) mode
      before TypeScript 7.0 removes it. This is a dedicated effort because the
      project is currently CommonJS end-to-end.

## v0.3.0 — Feature enrichment [Planned]

- [ ] Configurable choice between numeric entities and named entities.
- [ ] Reverse command: HTML entity to character.
- [ ] Support for multiple selections.
- [ ] Internationalization of the interface labels.
