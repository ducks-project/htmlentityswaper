# Acceptation — Surcharges

Scénarios d'acceptation au format Given/When/Then pour le réglage
`htmlentityswaper.overrides`, qui permet d'ajouter, d'écraser ou de désactiver une
correspondance selon le format `clé === valeur`.

## Ajouter un caractère

- Étant donné une surcharge associant un caractère absent de la table par défaut à une
  entité HTML,
- quand l'utilisateur lance un remplacement,
- alors ce caractère est désormais remplacé par l'entité fournie.

## Écraser une correspondance

- Étant donné une surcharge associant un caractère déjà présent dans la table par défaut
  à une entité différente,
- quand l'utilisateur lance un remplacement,
- alors ce caractère est remplacé par l'entité de la surcharge, et non par celle par défaut.

## Désactiver une correspondance

- Étant donné une surcharge associant un caractère de la table par défaut à une valeur vide,
- quand l'utilisateur lance un remplacement,
- alors ce caractère n'est plus remplacé.

## Prise en compte immédiate

- Étant donné une table d'entités déjà construite pour la session,
- quand l'utilisateur modifie le réglage `htmlentityswaper.overrides`,
- alors le remplacement suivant reflète la nouvelle configuration, sans rechargement de la fenêtre.
