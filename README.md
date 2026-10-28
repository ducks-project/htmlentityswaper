# HTML Entity Swapper

[![Open VSX](https://img.shields.io/badge/Open%20VSX-ducks--project.htmlentityswaper-purple)](https://open-vsx.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

Extension pour IDE compatible VS Code (Kiro, VS Code, forks) qui remplace les
caractères spéciaux et accentués par leurs entités HTML, dans tout le document ou
dans la sélection courante.

## Fonctionnalités

- Deux commandes : remplacement sur le document entier ou sur la sélection.
- Table de correspondance par défaut d'un peu plus de deux cents caractères,
  dédoublonnée et corrigée.
- Surcharges utilisateur pour ajouter, écraser ou désactiver des remplacements.
- Modifications appliquées en une seule édition groupée : une unique annulation.
- Prise en compte immédiate des changements de configuration, sans rechargement.
- Traitement entièrement local : aucun réseau, aucune télémétrie.

## Installation

Depuis Open VSX :

- ouvrir la vue Extensions de l'IDE ;
- rechercher « HTML Entity Swapper » ;
- installer l'extension publiée sous l'identifiant `ducks-project.htmlentityswaper`.

Depuis un paquet local :

```bash
code --install-extension htmlentityswaper-0.1.0.vsix
```

## Utilisation

Ouvrir la palette de commandes, puis lancer l'une des deux commandes :

- `Remplacer les caracteres par des entites HTML (document)` traite tout le fichier ;
- `Remplacer les caracteres par des entites HTML (selection)` traite la sélection active.

## Configuration

La table de correspondance est personnalisable via le réglage
`htmlentityswaper.overrides`. Chaque entrée suit le format `clé === valeur` : la clé
est le caractère à remplacer, la valeur est l'entité HTML à produire.

Ajouter un caractère absent de la table par défaut :

```json
{
  "htmlentityswaper.overrides": {
    "★": "&#9733;"
  }
}
```

Écraser une entrée existante :

```json
{
  "htmlentityswaper.overrides": {
    "é": "&#233;"
  }
}
```

Désactiver un remplacement en donnant une valeur vide :

```json
{
  "htmlentityswaper.overrides": {
    "©": ""
  }
}
```

Les surcharges sont prises en compte immédiatement, sans rechargement de la fenêtre.

## Développement

```bash
npm install
npm run compile
npm run build
npm run lint
npm run test:unit
```

## Architecture

Le code suit une architecture en couches : un cœur pur (`core/`) sans dépendance à
l'API de l'éditeur, des ports (interfaces) et des adaptateurs (`adapters/`) qui sont
la seule couche à importer `vscode`. Les détails et le diagramme figurent dans
[docs/architecture.md](./docs/architecture.md).

## Contribution

Les règles de contribution, de style et de commit sont décrites dans
[CONTRIBUTING.md](./CONTRIBUTING.md).

## Licence

Distribué sous licence MIT. Voir [LICENSE](./LICENSE).

## Crédits

L'idée et la table de correspondance initiale proviennent de l'extension
[enriquein/htmlentity-replacer](https://github.com/enriquein/htmlentity-replacer).
Seules l'idée et les données ont été réutilisées ; l'implémentation est une
réécriture complète.
