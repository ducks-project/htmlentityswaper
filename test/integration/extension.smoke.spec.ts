import { expect } from 'chai';
import * as vscode from 'vscode';

/**
 * Fully-qualified identifier of the extension under test, as declared in
 * `package.json` (`publisher.name`).
 */
const EXTENSION_ID = 'ducks-project.htmlentityswaper';

/** Command replacing every mappable character in the whole document. */
const COMMAND_REPLACE_IN_DOCUMENT = 'htmlentityswaper.replaceInDocument';
/** Command replacing every mappable character within the current selection. */
const COMMAND_REPLACE_IN_SELECTION = 'htmlentityswaper.replaceInSelection';

/** Information message shown when a command has nothing to replace. */
const MESSAGE_NOTHING_TO_REPLACE = 'No characters to replace.';

/**
 * Whether the suite runs under continuous integration. When true, a missing
 * extension/display must FAIL explicitly instead of being skipped, so a broken
 * CI environment can never let the integration suite pass silently.
 */
const isCi = 'true' === process.env.CI;

/**
 * Command identifiers the extension must contribute, matching the `contributes`
 * section of `package.json`.
 */
const EXPECTED_COMMANDS: readonly string[] = [
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
 * Real integration test running inside the VS Code extension host.
 *
 * It verifies activation, command registration, the document/selection
 * replacement behaviour, the information messages shown on no-op paths, and that
 * a single undo restores the original text (proof that every edit is grouped
 * into one `WorkspaceEdit`).
 *
 * Missing-extension handling depends on the environment: locally (outside CI)
 * the suite stays tolerant and skips when no display/editor is available, so a
 * developer without a headless display is not blocked. Under CI
 * (`CI === 'true'`, run through `xvfb-run`) a missing extension is a hard
 * FAILURE instead of a skip, so a broken CI environment can never let the
 * integration suite pass silently.
 */
describe('Extension integration', () => {
  before(async function activateExtension() {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    if (undefined === extension) {
      if (isCi) {
        throw new Error(
          'Extension not loaded under CI; a display/editor is required and must not be skipped.',
        );
      }
      this.skip();
      return;
    }
    await extension.activate();
  });

  it('activates and registers both contributed commands', async () => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    expect(extension?.isActive).to.equal(true);

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

  // The "no active editor" path (activeTextEditor === undefined) is not asserted
  // here: the extension-host harness always keeps an editor active after
  // opening a document, so that state cannot be reached reliably without closing
  // every editor, which races with the host. It is covered by the early return
  // in `withActiveEditor` and exercised through the two no-op message cases above.

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
});
