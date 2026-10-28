# Publication

Ce document décrit la procédure de publication de l'extension sur
[Open VSX](https://open-vsx.org/), sous le namespace `ducks-project`.

## Prérequis

- Un compte Open VSX avec le droit de publier sous le namespace `ducks-project`.
- Un jeton d'accès personnel Open VSX. Ce jeton ne doit jamais être committé ni partagé.

## Création du namespace

Opération à effectuer une seule fois :

```bash
ovsx create-namespace ducks-project -p "$OVSX_TOKEN"
```

## Packaging

Construire le paquet `.vsix` avant publication :

```bash
npm run build
npm run package
```

## Publication manuelle

```bash
ovsx publish -p "$OVSX_TOKEN"
```

## Publication automatisée en CI

La publication est déclenchée par la CI sur la création d'un tag `v*` (par exemple
`v0.1.0`). Le jeton est fourni à la CI via le secret `OVSX_TOKEN` ; il n'apparaît
jamais en clair dans le dépôt. Le workflow de release construit le paquet puis exécute
`ovsx publish`.

## Vérifications avant publication

- Le numéro de version de `package.json` correspond au tag.
- Le [changelog](../CHANGELOG.md) décrit la version publiée.
- Lint, compilation et tests passent.
