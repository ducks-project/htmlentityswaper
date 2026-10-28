# Contribuer

Merci de votre intérêt pour HTML Entity Swapper. Ce guide décrit l'installation,
les conventions, les tests et le processus de contribution.

## Prérequis

- Node.js 20 ou plus récent et npm.
- Un IDE compatible VS Code pour tester l'extension.

## Installation

```bash
npm install
```

L'installation met en place [lefthook](https://github.com/evilmartians/lefthook), qui
branche les hooks Git du projet (vérifications avant commit et avant push).

## Conventions

Le code doit respecter les règles de revue et de style du projet, consignées dans les
steering suivantes :

- [Conventions TypeScript](./.kiro/steering/typescript-conventions.md)
- [Lignes directrices pour l'extension VS Code](./.kiro/steering/vscode-extension-guidelines.md)
- [Stratégie de test](./.kiro/steering/testing-strategy.md)

En résumé : TypeScript strict, pas de `any`, interfaces préfixées `I`, early return,
style Yoda, fonctions courtes, modules ES, et commentaires et JSDoc en anglais.

## Lancer les tests

```bash
npm run test:unit
npm run test:property
npm run test:integration
npm run bench
```

En environnement sans affichage, les tests d'intégration peuvent être ignorés
localement ; ils tournent en CI via un affichage virtuel.

## Vérifications locales

```bash
npm run lint
npm run compile
npm run build
```

## Format de commit

Le projet suit la convention
[Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/). Utiliser un
préfixe de type : `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.

## Processus de pull request

- Créer une branche dédiée à partir de la branche par défaut.
- S'assurer que lint, compilation et tests passent.
- Documenter le changement et mettre à jour le [changelog](./CHANGELOG.md) si pertinent.
- Ouvrir la pull request avec une description claire du problème et de la solution.
