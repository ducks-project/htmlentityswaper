# ADR 0001 — Choosing TypeScript

## Status

Accepted.

## Context

The extension targets VS Code-compatible IDEs, whose API and ecosystem are heavily typed
in TypeScript. The code must be reliable, maintainable, and distributed at a large scale,
with clear contracts between the layers.

## Decision

The code is written in TypeScript in strict mode. The `any` type is forbidden, interfaces
are prefixed with `I`, and the full convention is in the
[TypeScript conventions](../../.kiro/steering/typescript-conventions.md) steering file.

## Consequences

- Error detection at compile time, better cross-layer contracts.
- Natural integration with the typed `vscode` API.
- A compilation cost; handled by esbuild for the bundle and `tsc --noEmit` for the type-check.
