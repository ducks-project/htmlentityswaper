# ADR 0001 — Choix de TypeScript

## Statut

Accepté.

## Contexte

L'extension cible des IDE compatibles VS Code, dont l'API et l'écosystème sont
massivement typés en TypeScript. Le code doit être fiable, maintenable et distribué
à large échelle, avec des contrats clairs entre les couches.

## Décision

Le code est écrit en TypeScript en mode strict. Le type `any` est interdit, les
interfaces sont préfixées `I`, et la convention complète figure dans la steering
[Conventions TypeScript](../../.kiro/steering/typescript-conventions.md).

## Conséquences

- Détection des erreurs à la compilation, meilleurs contrats inter-couches.
- Intégration naturelle avec l'API `vscode` typée.
- Coût de compilation ; géré par esbuild pour le bundle et `tsc --noEmit` pour le type-check.
