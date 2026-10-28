# ADR 0006 — Édition groupée plutôt qu'une édition par caractère

## Statut

Accepté.

## Contexte

L'extension de référence applique une édition `editor.edit()` par caractère remplacé.
Cela produit une pile d'annulation encombrée (une annulation par caractère) et
dégrade les performances sur les gros documents.

## Décision

Toutes les modifications d'une commande sont regroupées dans un unique
`vscode.WorkspaceEdit` appliqué une seule fois par le contrôleur de commandes
([CommandController](../../src/adapters/CommandController.ts)). Le cœur calcule la
liste complète des remplacements ([ReplacementResult](../../src/core/models/ReplacementResult.ts))
avant application.

## Conséquences

- Une seule étape d'annulation pour l'utilisateur.
- Meilleures performances sur les documents volumineux.
- Séparation nette entre calcul (cœur) et application (adaptateur).
