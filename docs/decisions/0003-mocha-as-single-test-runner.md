# ADR 0003 — Mocha as the single test runner

## Status

Accepted.

## Context

The project needs unit, property-based, and VS Code integration tests. Multiplying the
runners complicates configuration and maintenance.

## Decision

Mocha is the single runner for all test levels, with Chai for assertions, fast-check for
property-based testing, and `@vscode/test-electron` for integration, driven by Mocha. This
choice is an explicit request from the maintainer.

## Consequences

- A single runner configuration, consistent end to end.
- The TypeScript tests run through `ts-node` in CommonJS mode (ESM interop).
- No Vitest or Jest in the project.
