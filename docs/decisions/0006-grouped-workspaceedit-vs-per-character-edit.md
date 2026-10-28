# ADR 0006 — Grouped edit rather than a per-character edit

## Status

Accepted.

## Context

The reference extension applies one `editor.edit()` call per replaced character. This
produces a cluttered undo stack (one undo per character) and degrades performance on large
documents.

## Decision

All changes from a command are grouped into a single `vscode.WorkspaceEdit` applied once by
the command controller ([CommandController](../../src/adapters/CommandController.ts)). The
core computes the complete list of replacements
([ReplacementResult](../../src/core/models/ReplacementResult.ts)) before application.

Edits are added to the `WorkspaceEdit` from the highest absolute offset to the lowest
(descending `position`), so applying a replacement never shifts the offsets of the edits that
follow. Absolute UTF-16 offsets are converted back to editor positions with
`document.positionAt`.

## Consequences

- A single undo step for the user. This is verified by an integration test that runs
  `replaceInDocument` and asserts one `undo` restores the original document text.
- Better performance on large documents.
- A clean separation between computation (core) and application (adapter).
