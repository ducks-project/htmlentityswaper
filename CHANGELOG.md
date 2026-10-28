# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Mise en place initiale du projet : structure de l'extension VS Code
  `ducks-project.htmlentityswaper` et chaîne d'outils (TypeScript strict, esbuild,
  ESLint, Prettier, lefthook).
- Architecture en couches cœur pur / ports / adaptateurs, avec squelettes des classes
  `EntityMap`, `EntityMapBuilder`, `EntityReplacer` et du contrôleur de commandes.
- Table de correspondance par défaut caractère vers entité HTML, dédoublonnée et corrigée.
- Deux commandes déclarées (document et sélection) et réglage `htmlentityswaper.overrides`.
- Suite de tests Mocha (unitaires, property-based, intégration) et benchmark mitata.
- Documentation du projet : README, ROADMAP, PRIVACY, CONTRIBUTING, LICENSE et dossier
  `docs/` (architecture, décisions, acceptation, tests, publication).

[unreleased]: https://github.com/ducks-project/htmlentityswaper/compare/HEAD
