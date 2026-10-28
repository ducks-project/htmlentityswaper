# ADR 0003 — Mocha comme runner de test unique

## Statut

Accepté.

## Contexte

Le projet a besoin de tests unitaires, property-based et d'intégration VS Code.
Multiplier les runners complique la configuration et la maintenance.

## Décision

Mocha est le runner unique pour tous les niveaux de test, avec Chai pour les
assertions, fast-check pour le property-based et `@vscode/test-electron` pour
l'intégration, piloté par Mocha. Ce choix est une demande explicite du mainteneur.

## Conséquences

- Une seule configuration de runner, cohérente de bout en bout.
- Les tests TypeScript s'exécutent via `ts-node` en mode CommonJS (interop ESM).
- Pas de Vitest ni de Jest dans le projet.
