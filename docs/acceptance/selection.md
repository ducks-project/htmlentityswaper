# Acceptation — Sélection

Scénarios d'acceptation au format Given/When/Then pour le remplacement limité à la
sélection courante.

## Remplacement dans la sélection

- Étant donné un document où l'utilisateur a sélectionné une portion de texte,
- quand l'utilisateur lance la commande de remplacement sur la sélection,
- alors seuls les caractères mappés situés dans la sélection sont remplacés, et le texte
  hors sélection reste inchangé.

## Sélection vide

- Étant donné un éditeur actif sans texte sélectionné,
- quand l'utilisateur lance la commande de remplacement sur la sélection,
- alors aucun caractère n'est remplacé en dehors d'une sélection effective.
