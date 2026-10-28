# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[unreleased]: https://github.com/ducks-project/htmlentityswaper/compare/HEAD
