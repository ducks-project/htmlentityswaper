# ADR 0002 — Open VSX as the distribution target

## Status

Accepted.

## Context

The extension targets the community of VS Code-compatible IDEs, including forks that do
not use the VS Code Marketplace. An open target that is compatible with these IDEs is
needed.

## Decision

The extension is published to [Open VSX](https://open-vsx.org/), under the `ducks-project`
namespace (identifier `ducks-project.htmlentityswaper`, publishing account `donaldinou`).
The procedure is described in [docs/publishing.md](../publishing.md).

## Consequences

- Compatibility with IDEs that consume Open VSX (including Kiro).
- Publishing via the `ovsx` tool and a personal token, automated in CI on tag.
- No dependency on the proprietary VS Code Marketplace.
