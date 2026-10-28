# Acceptance — Single undo

Acceptance scenario in Given/When/Then format for the undo behavior after a replacement.

## Undo in a single step

- Given a document where several characters were replaced by a single command,
- when the user triggers an undo,
- then all of that command's replacements are undone in a single step, and the document
  returns to its initial state.
