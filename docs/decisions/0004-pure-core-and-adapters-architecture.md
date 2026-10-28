# ADR 0004 — Pure core and adapters architecture

## Status

Accepted.

## Context

The replacement logic must be testable without a VS Code host and reusable for a future
web extension. Mixing the business logic and the editor API would hurt testability and
portability.

## Decision

The code follows a layered architecture: a pure core (`core/`) that never imports
`vscode`, ports (interfaces), and adapters (`adapters/`), the only layer to import
`vscode`. The core depends on the abstractions (Dependency Inversion). The details are in
[docs/architecture.md](../architecture.md).

## Consequences

- The core is testable under Mocha with no editor harness.
- Portability to a web target (ROADMAP v0.2.0).
- A single, explicit boundary with the editor API.
