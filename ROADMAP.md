# Roadmap

Ce document décrit les versions prévues de HTML Entity Swapper. Les dates ne sont
pas figées ; l'ordre des jalons l'est. Les détails évoluent avec le projet.

## v0.1.0 — MVP

- Les deux commandes opérationnelles : remplacement sur le document et sur la sélection.
- Table de correspondance par défaut dédoublonnée et corrigée.
- Surcharges utilisateur `htmlentityswaper.overrides` (ajouter, écraser, désactiver).
- Édition groupée avec annulation unique, prise en compte immédiate de la configuration.
- Suite de tests unitaires, property-based et d'intégration en place.

## v0.2.0 — Portabilité et mesure

- Extension web complète (cible navigateur du bundle), validée dans un hôte web.
- Benchmarks mitata publiés et suivis dans la documentation.
- Durcissement de la couverture de tests sur le cœur et les adaptateurs.

## v0.3.0 — Enrichissement fonctionnel

- Choix configurable entre entités numériques et entités nommées.
- Commande inverse : entité HTML vers caractère.
- Prise en charge des sélections multiples.
- Internationalisation des libellés de l'interface.
