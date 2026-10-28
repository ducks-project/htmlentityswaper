# ADR 0004 — Architecture cœur pur et adaptateurs

## Statut

Accepté.

## Contexte

La logique de remplacement doit être testable sans hôte VS Code et réutilisable pour
une future extension web. Mélanger la logique métier et l'API de l'éditeur nuirait à
la testabilité et à la portabilité.

## Décision

Le code suit une architecture en couches : un cœur pur (`core/`) qui n'importe jamais
`vscode`, des ports (interfaces) et des adaptateurs (`adapters/`), seule couche à
importer `vscode`. Le cœur dépend des abstractions (Dependency Inversion). Les détails
figurent dans [docs/architecture.md](../architecture.md).

## Conséquences

- Le cœur se teste sous Mocha sans harnais d'éditeur.
- Portabilité vers une cible web (ROADMAP v0.2.0).
- Une frontière unique et explicite avec l'API de l'éditeur.
