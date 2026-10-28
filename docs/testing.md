# Tests

Ce document explique comment lancer chaque type de test et ce que couvre chaque niveau.
La stratégie d'ensemble est décrite dans la steering
[Stratégie de test](../.kiro/steering/testing-strategy.md).

## Tests unitaires

Cible : la couche cœur (logique pure). Vérifient `EntityMap`, `EntityMapBuilder`,
`EntityReplacer` et la table de données (comptage, absence de clé dupliquée, exclusion
du guillemet double).

```bash
npm run test:unit
```

## Tests property-based

Cible : `EntityReplacer`, propriétés invariantes sur des entrées générées par fast-check
(idempotence, préservation des caractères non mappés, non-corruption des paires UTF-16).

```bash
npm run test:property
```

## Tests d'intégration

Cible : les deux commandes dans un hôte VS Code réel via `@vscode/test-electron`
(enregistrement des commandes, remplacement sur sélection, annulation unique, prise en
compte immédiate de la configuration).

```bash
npm run test:integration
```

En environnement sans affichage, ces tests peuvent être ignorés localement ; en CI, ils
tournent via un affichage virtuel.

## Benchmark

Cible : coût d'un remplacement groupé sur des documents de tailles variées, avec mitata.
Les mesures sont informatives et ne bloquent pas la CI.

```bash
npm run bench
```
