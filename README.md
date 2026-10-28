# HTML Entity Swapper

[![Open VSX](https://img.shields.io/badge/Open%20VSX-ducks--project.htmlentityswaper-purple)](https://open-vsx.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

Extension for VS Code-compatible IDEs (Kiro, VS Code, forks) that replaces special and
accented characters with their HTML entities, either across the whole document or within
the current selection.

## Features

- Two commands: replace across the entire document or within the selection.
- Default entity map of a little over two hundred characters, deduplicated and corrected.
- User overrides to add, replace, or disable individual mappings.
- Changes applied as a single grouped edit: a single undo step.
- Configuration changes picked up immediately, with no reload.
- Fully local processing: no network, no telemetry.

## Installation

From Open VSX:

- open the IDE's Extensions view;
- search for "HTML Entity Swapper";
- install the extension published under the identifier `ducks-project.htmlentityswaper`.

From a local package:

```bash
code --install-extension htmlentityswaper-0.1.0.vsix
```

## Usage

Open the command palette, then run one of the two commands:

- `Replace characters with HTML entities (document)` processes the whole file;
- `Replace characters with HTML entities (selection)` processes the active selection.

## Configuration

The entity map is customizable through the `htmlentityswaper.overrides` setting. Each
entry follows the `key === value` format: the key is the character to replace, the value
is the HTML entity to produce.

Add a character missing from the default map:

```json
{
  "htmlentityswaper.overrides": {
    "★": "&#9733;"
  }
}
```

Override an existing entry:

```json
{
  "htmlentityswaper.overrides": {
    "é": "&#233;"
  }
}
```

Disable a mapping by giving it an empty value:

```json
{
  "htmlentityswaper.overrides": {
    "©": ""
  }
}
```

Overrides are picked up immediately, with no window reload.

## Development

```bash
npm install
npm run compile
npm run build
npm run lint
npm run test:unit
```

## Architecture

The code follows a layered architecture: a pure core (`core/`) with no dependency on the
editor API, ports (interfaces), and adapters (`adapters/`) that are the only layer to
import `vscode`. The details and the diagram are in
[docs/architecture.md](./docs/architecture.md).

## Contributing

The contribution, style, and commit rules are described in
[CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Distributed under the MIT license. See [LICENSE](./LICENSE).

## Credits

The idea and the initial entity map come from the
[enriquein/htmlentity-replacer](https://github.com/enriquein/htmlentity-replacer)
extension. Only the idea and the data were reused; the implementation is a complete
rewrite.
