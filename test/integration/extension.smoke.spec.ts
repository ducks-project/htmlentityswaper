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
 * Real integration test running inside the VS Code extension host.
 *
 * It verifies activation, command registration, the document/selection
 * replacement behaviour, and that a single undo restores the original text
 * (proof that every edit is grouped into one `WorkspaceEdit`). It is tolerant of
 * a headless environment where the extension is not loaded: the suite then skips
 * rather than failing. In CI under `xvfb-run` the assertions run for real.
 */
describe('Extension integration', () => {
  before(async function activateExtension() {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    if (undefined === extension) {
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
