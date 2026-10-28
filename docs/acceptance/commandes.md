# Acceptation — Commandes

Scénarios d'acceptation au format Given/When/Then pour les deux commandes de
remplacement. Ils décrivent le comportement attendu côté utilisateur.

## Remplacement sur le document

- Étant donné un document contenant des caractères accentués ou spéciaux mappés
  dans la table,
- quand l'utilisateur lance la commande de remplacement sur le document,
- alors chaque caractère mappé du document est remplacé par son entité HTML, et les
  caractères non mappés restent inchangés.

## Remplacement sans éditeur actif

- Étant donné qu'aucun éditeur de texte n'est actif,
- quand l'utilisateur lance une commande de remplacement,
- alors aucune modification n'est appliquée et l'utilisateur n'obtient pas d'erreur bloquante.

## Caractère guillemet double

- Étant donné un document contenant le caractère guillemet double,
- quand l'utilisateur lance une commande de remplacement sans surcharge le concernant,
- alors le guillemet double reste inchangé, car il n'est pas remplacé par défaut.
