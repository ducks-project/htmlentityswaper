# Publishing

This document describes the procedure for publishing the extension to
[Open VSX](https://open-vsx.org/), under the `ducks-project` namespace.

## Prerequisites

- An Open VSX account with permission to publish under the `ducks-project` namespace.
- An Open VSX personal access token. This token must never be committed or shared.

## Creating the namespace

A one-time operation:

```bash
ovsx create-namespace ducks-project -p "$OVSX_TOKEN"
```

## Packaging

Build the `.vsix` package before publishing:

```bash
npm run build
npm run package
```

## Manual publishing

```bash
ovsx publish -p "$OVSX_TOKEN"
```

## Automated publishing in CI

Publishing is triggered by CI on the creation of a `v*` tag (for example `v0.1.0`). The
token is provided to CI through the `OVSX_TOKEN` secret; it never appears in plain text in
the repository. The release workflow builds the package and then runs `ovsx publish`.

## Pre-publishing checks

- The version number in `package.json` matches the tag.
- The [changelog](../CHANGELOG.md) describes the published version.
- Lint, compilation, and tests pass.
