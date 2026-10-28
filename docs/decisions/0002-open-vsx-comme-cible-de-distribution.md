# ADR 0002 — Open VSX comme cible de distribution

## Statut

Accepté.

## Contexte

L'extension s'adresse à la communauté des IDE compatibles VS Code, y compris des forks
qui n'utilisent pas le Marketplace de VS Code. Une cible ouverte et compatible avec ces
IDE est nécessaire.

## Décision

L'extension est publiée sur [Open VSX](https://open-vsx.org/), sous le namespace
`ducks-project` (identifiant `ducks-project.htmlentityswaper`, compte de publication
`donaldinou`). La procédure est décrite dans [docs/publishing.md](../publishing.md).

## Conséquences

- Compatibilité avec les IDE qui consomment Open VSX (dont Kiro).
- Publication via l'outil `ovsx` et un jeton personnel, automatisée en CI sur tag.
- Pas de dépendance au Marketplace propriétaire de VS Code.
