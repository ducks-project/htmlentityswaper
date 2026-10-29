# Manual host validation

This document records the manual validation of the extension loading and running in hosts
whose engine version cannot be verified programmatically. It complements the automated
`@vscode/test-electron` (Node host) and `@vscode/test-web` (web host) suites with a manual,
documented procedure for a Web Extension Host and for the Kiro host, and a log of each
validation run.

The automated suites prove behaviour against a downloaded VS Code build. This procedure
exists because the Kiro host embeds a VS Code engine whose exact version is not exposed
programmatically (see [ADR 0005](decisions/0005-wide-engines-vscode-range-for-kiro-compatibility.md)),
so portability to it is confirmed by hand and the observed version is recorded here.

## Conventions

- Each procedure uses the same two-character sample and the same expected outputs, so a
  result can be compared across hosts.
- The outcome of each command is recorded as exactly one of `pass` or `fail`.
- When a command does not produce its expected observable outcome, its outcome is recorded
  as `fail` together with the observed deviation.

## Sample input and expected outputs

Use a plain-text document whose content is exactly:

```text
Café € "x"
```

Expected observable outcomes:

- **Document command** (`HTML Entity Swapper: Replace characters with HTML entities
(document)`): the whole document becomes `Caf&eacute; &euro; "x"`. The accented `é` and
  the euro sign `€` are replaced; the ASCII letters, spaces, and the double quotes stay
  unchanged (the double quote is intentionally not mapped by default).
- **Selection command** (`HTML Entity Swapper: Replace characters with HTML entities
(selection)`): with only the first word `Café` selected (characters 0 to 4 on line 0),
  the document becomes `Caf&eacute; € "x"`. Only the selected `é` is replaced; the euro sign
  outside the selection stays unchanged.

If the document or selection has no mappable character, or the selection is empty, the
command makes no change and surfaces the information message `No characters to replace.`.

## Procedure A — Web Extension Host

Validates Requirement 1 (web target) and Requirement 7.8 by hand, in a browser-based editor
running the extension in a Web Worker.

1. Build the browser bundle: run `npm run build` and confirm `dist/browser/extension.js`
   is produced without error.
2. Start a Web Extension Host that loads the extension from the repository root. The
   simplest path is `npm run test:web`, which launches `@vscode/test-web` with the
   extension under development; for an interactive session, run
   `npx @vscode/test-web --extensionDevelopmentPath=. .` and open the printed local URL in
   a browser.
3. Open the browser editor's About/version information and record the host name and the
   version string as observed (see the run log below).
4. Create a new plain-text file and paste the sample input from above.
5. Open the Command Palette and run `HTML Entity Swapper: Replace characters with HTML
entities (document)`. Record `pass` if the document matches the expected document
   output, `fail` otherwise (with the observed deviation).
6. Undo the change (a single undo must restore the original text).
7. Select the first word `Café` only, then run `HTML Entity Swapper: Replace characters
with HTML entities (selection)`. Record `pass` if the document matches the expected
   selection output, `fail` otherwise (with the observed deviation).

## Procedure B — Kiro host

Validates portability to the Kiro host, whose embedded VS Code engine version is not
programmatically verifiable (Requirement 2.3).

1. Package or install the extension in Kiro from the repository (for example, build the
   `.vsix` with `npm run package` and install it, or load it as a development extension).
2. Open Kiro's About/version information and record the Kiro host name and the version
   string exactly as shown there, by hand (see the run log below). This is the manually
   observed version required because Kiro does not expose it programmatically.
3. Create a new plain-text file and paste the sample input from above.
4. Run `HTML Entity Swapper: Replace characters with HTML entities (document)` from the
   command palette. Record `pass` if the document matches the expected document output,
   `fail` otherwise (with the observed deviation).
5. Undo the change (a single undo must restore the original text).
6. Select the first word `Café` only, then run `HTML Entity Swapper: Replace characters
with HTML entities (selection)`. Record `pass` if the document matches the expected
   selection output, `fail` otherwise (with the observed deviation).

## Run log

Record one row per validation run. `Host` is the host name, `Version` is the version string
observed manually from the host's About/version information, and the two outcome columns are
each exactly `pass` or `fail`. When an outcome is `fail`, describe the observed deviation in
the `Deviation` column; leave it empty when both commands pass.

| Date (UTC)    | Host               | Version (observed) | Document command | Selection command | Deviation |
| ------------- | ------------------ | ------------------ | ---------------- | ----------------- | --------- |
| _not yet run_ | Web Extension Host | _record on run_    | _pass/fail_      | _pass/fail_       |           |
| _not yet run_ | Kiro               | _record on run_    | _pass/fail_      | _pass/fail_       |           |
