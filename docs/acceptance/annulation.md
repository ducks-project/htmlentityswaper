# Acceptation — Annulation unique

Scénario d'acceptation au format Given/When/Then pour le comportement d'annulation
après un remplacement.

## Annulation en une seule étape

- Étant donné un document où plusieurs caractères ont été remplacés par une même commande,
- quand l'utilisateur déclenche une annulation,
- alors l'ensemble des remplacements de cette commande est annulé en une seule étape, et
  le document revient à son état initial.
