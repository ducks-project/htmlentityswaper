# ADR 0005 — Plancher `engines.vscode` large pour la compatibilité

## Statut

Accepté.

## Contexte

L'extension vise plusieurs IDE compatibles VS Code (dont Kiro et divers forks), qui
embarquent des versions variées de l'API `vscode`. Un plancher trop récent exclurait
des hôtes légitimes.

## Décision

Le champ `engines.vscode` est fixé à `^1.85.0`. Ce plancher reste assez ancien pour
couvrir un large éventail d'IDE compatibles, tout en donnant accès aux API utilisées
par l'extension. Le paquet `@types/vscode` est aligné sur `1.85.0`.

## Conséquences

- Compatibilité maximisée avec les hôtes compatibles VS Code.
- L'extension se limite aux API disponibles depuis la 1.85.0.
- Le plancher pourra être relevé plus tard si une API plus récente devient nécessaire.
