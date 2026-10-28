# Architecture

HTML Entity Swapper is structured in layers to isolate the business logic from the editor
API. The goal: a core that is testable without a VS Code host, portable (web), and a single
boundary with `vscode`.

## Layers

- Core (`core/`): pure logic. Never imports `vscode`. Contains the entity map, the map
  builder, the compute engine, and the value objects.
- Ports (`core/ports/`): interfaces describing what the core needs
  ([IConfigurationProvider](../src/core/ports/IConfigurationProvider.ts),
  [ITextDocument](../src/core/ports/ITextDocument.ts)).
- Adapters (`adapters/`): the only layer that imports `vscode`. Implements the ports and
  applies the edits.
- Entry point ([extension.ts](../src/extension.ts)): composition root that wires the
  dependencies and registers the commands.

## Layer diagram

```mermaid
flowchart TD
  subgraph Host["VS Code / Kiro host"]
    EXT["extension.ts (composition root)"]
  end

  subgraph Adapters["adapters/ (imports vscode)"]
    CC["CommandController"]
    VCP["VscodeConfigurationProvider"]
    VDA["VscodeDocumentAdapter"]
  end

  subgraph Ports["core/ports/"]
    ICP["IConfigurationProvider"]
    ITD["ITextDocument"]
  end

  subgraph Core["core/ (pure, no vscode)"]
    EMB["EntityMapBuilder"]
    EM["EntityMap"]
    ER["EntityReplacer"]
    RR["ReplacementResult / Replacement"]
    DE["default-entities (data)"]
  end

  EXT --> CC
  EXT --> VCP
  CC --> VDA
  CC --> EMB
  CC --> ER
  VCP -. implements .-> ICP
  VDA -. implements .-> ITD
  EMB --> EM
  EMB --> DE
  ER --> EM
  ER --> ITD
  ER --> RR
```

## Command flow

```mermaid
sequenceDiagram
  participant U as User
  participant X as extension.ts
  participant C as CommandController
  participant B as EntityMapBuilder
  participant R as EntityReplacer
  participant W as WorkspaceEdit (vscode)

  U->>X: invokes the command
  X->>C: replaceInDocument/replaceInSelection(editor)
  C->>B: withDefaults().withOverrides(overrides).build()
  B-->>C: EntityMap
  C->>R: computeReplacements(document, range?)
  R-->>C: ReplacementResult (edits)
  C->>W: applies a single grouped WorkspaceEdit
  W-->>U: document modified, a single undo step
```

## Patterns

- Builder (fluent interface):
  [EntityMapBuilder](../src/core/EntityMapBuilder.ts) assembles defaults and overrides
  into an immutable [EntityMap](../src/core/EntityMap.ts) with O(1) lookup, and returns `this`.
- Adapter: [VscodeConfigurationProvider](../src/adapters/VscodeConfigurationProvider.ts)
  and [VscodeDocumentAdapter](../src/adapters/VscodeDocumentAdapter.ts) connect the editor
  API to the core's ports.
- Dependency Inversion: the core depends on the ports, not on the concrete adapters.
- Immutable value objects: [Replacement](../src/core/models/Replacement.ts) and
  [ReplacementResult](../src/core/models/ReplacementResult.ts), with no mutation.

## Fixes relative to the reference extension

- A single grouped edit (`WorkspaceEdit`) instead of one edit per character: a single undo
  step and better performance.
- On-demand rebuild of the map, invalidated on configuration change: no window reload needed.
- Entity map deduplicated and corrected in
  [default-entities.ts](../src/data/default-entities.ts).
