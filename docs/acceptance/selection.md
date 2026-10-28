# Acceptance — Selection

Acceptance scenarios in Given/When/Then format for replacement limited to the current
selection.

## Replacement within the selection

- Given a document where the user has selected a portion of text,
- when the user runs the selection replacement command,
- then only the mapped characters inside the selection are replaced, and the text outside
  the selection remains unchanged.

## Empty selection

- Given an active editor with no selected text,
- when the user runs the selection replacement command,
- then no character is replaced outside an effective selection, and the user sees the
  information message `No characters to replace.`.
