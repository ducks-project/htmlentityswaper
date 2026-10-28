# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Extension icon (`media/icon.png`, 128x128 PNG) declared via the `icon` field in
  `package.json`, shown on the Open VSX and VS Code Marketplace listings. The image is
  losslessly optimised (oxipng), reducing its size from 29,807 to 24,649 bytes.

## [0.1.0] - 2026-10-28

### Added

- Initial project setup: structure of the `ducks-project.htmlentityswaper` VS Code
  extension and toolchain (strict TypeScript, esbuild, ESLint, Prettier, lefthook).
- Layered pure core / ports / adapters architecture, with skeletons for the `EntityMap`,
  `EntityMapBuilder`, and `EntityReplacer` classes and the command controller.
- Default character-to-HTML-entity map, deduplicated and corrected.
- Two declared commands (document and selection) and the `htmlentityswaper.overrides` setting.
- Mocha test suite (unit, property-based, integration) and a mitata benchmark.
- Project documentation: README, ROADMAP, PRIVACY, CONTRIBUTING, LICENSE, and the `docs/`
  folder (architecture, decisions, acceptance, testing, publishing).
- Core replacement logic: `EntityMap` immutable O(1) lookup table, fluent `EntityMapBuilder`
  (defaults load plus add / overwrite / disable overrides), and the pure `EntityReplacer`
  with UTF-16-safe, code-point iteration that never splits a surrogate pair.
- The `htmlentityswaper.replaceInDocument` and `htmlentityswaper.replaceInSelection` commands,
  applying all changes as a single grouped `WorkspaceEdit` (one undo step).
- Override support through the `htmlentityswaper.overrides` setting, with disable when the
  value is empty or equal to its key, applied on every command with no window reload.
- Activated unit, property-based, and integration test suites, all passing.
- Information messages on no-op command paths: `No active editor.` when no editor is active,
  and `No characters to replace.` when the document or selection (including an empty selection)
  has no mappable character. A successful replacement stays silent.

### Changed

- Align the ESLint `yoda` rule with the project's documented Yoda-style convention
  (`["error", "always", { "onlyEquality": true }]`), overriding the Airbnb base default so the
  linter enforces the constant on the left in equality comparisons.
- Clear the redundant `onCommand:` entries from `activationEvents`: VS Code 1.74+ derives
  them automatically from the declared `contributes.commands`, and the extension targets
  `^1.85.0`.

[unreleased]: https://github.com/ducks-project/htmlentityswaper/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ducks-project/htmlentityswaper/releases/tag/v0.1.0
