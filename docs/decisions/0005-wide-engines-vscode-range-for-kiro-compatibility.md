# ADR 0005 — Wide `engines.vscode` floor for compatibility

## Status

Accepted.

## Context

The extension targets several VS Code-compatible IDEs (including Kiro and various forks),
which ship varying versions of the `vscode` API. A floor that is too recent would exclude
legitimate hosts.

## Decision

The `engines.vscode` field is set to `^1.85.0`. This floor stays old enough to cover a
wide range of compatible IDEs, while still giving access to the APIs used by the
extension. The `@types/vscode` package is aligned on `1.85.0`.

## Consequences

- Compatibility maximized with VS Code-compatible hosts.
- The extension is limited to the APIs available since 1.85.0.
- The floor can be raised later if a newer API becomes necessary.
