# Acceptance — Commands

Acceptance scenarios in Given/When/Then format for the two replacement commands. They
describe the expected behavior from the user's side.

## Replacement across the document

- Given a document containing accented or special characters mapped in the entity map,
- when the user runs the document replacement command,
- then every mapped character in the document is replaced by its HTML entity, and the
  unmapped characters remain unchanged.

## Replacement with no active editor

- Given that no text editor is active,
- when the user runs a replacement command,
- then no change is applied, no blocking error is raised, and the user sees the information
  message `No active editor.`.

## Replacement with nothing to replace

- Given a document (or selection) with no character mapped in the entity map,
- when the user runs a replacement command,
- then the document is left unchanged and the user sees the information message
  `No characters to replace.`.

## Silent success

- Given a document containing at least one mapped character,
- when the user runs a replacement command,
- then the mapped characters are replaced and no information message is shown.

## Double quote character

- Given a document containing the double quote character,
- when the user runs a replacement command with no override covering it,
- then the double quote remains unchanged, because it is not replaced by default.
