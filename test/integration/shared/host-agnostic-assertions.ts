import { expect } from 'chai';
import * as vscode from 'vscode';

/**
 * Host-agnostic integration assertions shared by every extension host.
 *
 * These checks exercise the extension exclusively through the `vscode` module
 * API, which is available in BOTH the Node-based extension host
 * (`@vscode/test-electron`) and the Web_Extension_Host (`@vscode/test-web`,
 * running inside a Browser Web Worker). The module therefore imports NO Node-only
 * built-in (`fs`, `path`, `os`, `crypto`, ...), so it bundles and runs unchanged in
 * a Web Worker.
 *
 * Host-specific bootstrap (activation in a `before` hook, the CI-skip policy, the
 * Mocha wiring) stays in each host entry point, which calls
 * {@link registerHostAgnosticAssertions} from inside its own `describe` block.
 */

/** Command replacing every mappable character in the whole document. */
export const COMMAND_REPLACE_IN_DOCUMENT = 'htmlentityswaper.replaceInDocument';
/** Command replacing every mappable character within the current selection. */
export const COMMAND_REPLACE_IN_SELECTION = 'htmlentityswaper.replaceInSelection';

/** Information message shown when a command has nothing to replace. */
export const MESSAGE_NOTHING_TO_REPLACE = 'No characters to replace.';

/**
 * Canonical host-parity fixture (Requirement 1.8).
 *
 * Both the Node-based extension host (`@vscode/test-electron`) and the
 * Web_Extension_Host (`@vscode/test-web`) load the SAME pure core, so feeding
 * the SAME input under the SAME default configuration (no overrides) must
 * produce the SAME output in each host. Asserting the whole-document
 * replacement against the hard-coded {@link PARITY_FIXTURE_EXPECTED_OUTPUT}
 * string in BOTH hosts therefore proves byte-for-byte parity: a divergence in
 * either host would miss the shared expected bytes.
 *
 * The input is deliberately mixed to make the determinism check meaningful:
 * - mapped BMP characters with named entities (`é`, `à`, `è`);
 * - mapped symbol characters (`€`, `™`);
 * - an unmapped supplementary-plane character (`😀`, a surrogate pair) that must
 *   survive unchanged and un-split in both hosts;
 * - unmapped ASCII (spaces, `!`) that must be preserved verbatim.
 *
 * The expected output is a fixed literal (the single source of truth both hosts
 * reference) rather than being recomputed from the map, so the assertion pins
 * the exact bytes instead of re-deriving them per host.
 */
export const PARITY_FIXTURE_INPUT = 'Café à la crème €™ 😀!';

/** Expected whole-document replacement output for {@link PARITY_FIXTURE_INPUT}. */
export const PARITY_FIXTURE_EXPECTED_OUTPUT =
  'Caf&eacute; &agrave; la cr&egrave;me &euro;&trade; 😀!';

/**
 * Command identifiers the extension must contribute, matching the `contributes`
 * section of `package.json`.
 */
export const EXPECTED_COMMANDS: readonly string[] = [
  COMMAND_REPLACE_IN_DOCUMENT,
  COMMAND_REPLACE_IN_SELECTION,
];

/**
 * Open an in-memory document with the given content and show it in an editor.
 * @param content Initial text of the document.
 * @returns The active editor for the opened document.
 */
async function openDocument(content: string): Promise<vscode.TextEditor> {
  const document = await vscode.workspace.openTextDocument({ content, language: 'plaintext' });
  return vscode.window.showTextDocument(document);
}

/**
 * Temporarily replace `vscode.window.showInformationMessage` with a stub that
 * records the first argument of every call, run the given body, then restore the
 * original function (even on failure). Avoids pulling in a mocking dependency.
 * @param body Callback executed while the stub is installed.
 * @returns The list of messages the code under test tried to show.
 */
async function captureInformationMessages(body: () => Promise<void>): Promise<string[]> {
  const messages: string[] = [];
  const original = vscode.window.showInformationMessage;
  // Record the message, then resolve like the real API (no button pressed).
  vscode.window.showInformationMessage = ((message: string): Thenable<string | undefined> => {
    messages.push(message);
    return Promise.resolve(undefined);
  }) as typeof vscode.window.showInformationMessage;
  try {
    await body();
  } finally {
    vscode.window.showInformationMessage = original;
  }
  return messages;
}

/**
 * Register the host-agnostic behavioural assertions as Mocha `it` cases inside the
 * caller's current `describe` block.
 *
 * The caller is responsible for host-specific bootstrap (activating the extension
 * in a `before` hook, the CI-skip policy, Mocha wiring). The assertions themselves
 * cover command registration, whole-document replacement, the no-op information
 * message on zero mappable characters, silence on a successful replacement,
 * empty-selection no-op, selection-only replacement, and the single-undo grouped
 * edit — none of which depend on a particular host.
 *
 * The "no active editor" path is deliberately not asserted here: the host harness
 * always keeps an editor active after opening a document, so that state cannot be
 * reached reliably without closing every editor, which races with the host. It is
 * covered by the early return in `withActiveEditor` and exercised through the two
 * no-op message cases below.
 */
export function registerHostAgnosticAssertions(): void {
  it('activates and registers both contributed commands', async () => {
    const commands = await vscode.commands.getCommands(true);
    EXPECTED_COMMANDS.forEach((command) => {
      expect(commands).to.include(command);
    });
  });

  it('replaces every mappable character in the whole document', async () => {
    const editor = await openDocument('Café à la crème');
    await vscode.commands.executeCommand(COMMAND_REPLACE_IN_DOCUMENT);
    expect(editor.document.getText()).to.equal('Caf&eacute; &agrave; la cr&egrave;me');
  });

  it('shows the "nothing to replace" message and leaves the document unchanged', async () => {
    const original = 'abc 123';
    const editor = await openDocument(original);
    const messages = await captureInformationMessages(async () => {
      await vscode.commands.executeCommand(COMMAND_REPLACE_IN_DOCUMENT);
    });
    expect(messages).to.deep.equal([MESSAGE_NOTHING_TO_REPLACE]);
    expect(editor.document.getText()).to.equal(original);
  });

  it('stays silent on a successful replacement', async () => {
    const editor = await openDocument('Café');
    const messages = await captureInformationMessages(async () => {
      await vscode.commands.executeCommand(COMMAND_REPLACE_IN_DOCUMENT);
    });
    expect(messages).to.deep.equal([]);
    expect(editor.document.getText()).to.equal('Caf&eacute;');
  });

  it('shows the "nothing to replace" message on an empty selection', async () => {
    const original = 'café';
    const editor = await openDocument(original);
    // Collapse the selection so it is empty (cursor at the start, no range).
    editor.selection = new vscode.Selection(0, 0, 0, 0);
    const messages = await captureInformationMessages(async () => {
      await vscode.commands.executeCommand(COMMAND_REPLACE_IN_SELECTION);
    });
    expect(messages).to.deep.equal([MESSAGE_NOTHING_TO_REPLACE]);
    expect(editor.document.getText()).to.equal(original);
  });

  it('replaces only the current selection and leaves the rest intact', async () => {
    const editor = await openDocument('café — thé');
    // Select the first word "café" only (characters 0..4 on line 0).
    editor.selection = new vscode.Selection(0, 0, 0, 4);
    await vscode.commands.executeCommand(COMMAND_REPLACE_IN_SELECTION);
    expect(editor.document.getText()).to.equal('caf&eacute; — thé');
  });

  it('restores the original text with a single undo (grouped WorkspaceEdit)', async () => {
    const original = 'Café à la crème';
    const editor = await openDocument(original);
    await vscode.commands.executeCommand(COMMAND_REPLACE_IN_DOCUMENT);
    expect(editor.document.getText()).to.not.equal(original);

    await vscode.commands.executeCommand('undo');
    expect(editor.document.getText()).to.equal(original);
  });

  it('produces byte-for-byte identical output for the shared host-parity fixture', async () => {
    // Feed the identical input and default configuration (no overrides) to the
    // core through the same command both hosts expose, then assert the result
    // equals the fixed expected bytes. Because both hosts run this same
    // assertion against the same literal, agreement in each host proves parity.
    const editor = await openDocument(PARITY_FIXTURE_INPUT);
    await vscode.commands.executeCommand(COMMAND_REPLACE_IN_DOCUMENT);
    expect(editor.document.getText()).to.equal(PARITY_FIXTURE_EXPECTED_OUTPUT);
  });
}
