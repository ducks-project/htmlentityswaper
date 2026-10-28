/* eslint-disable @typescript-eslint/no-unused-vars, no-useless-return */
// Scaffold stub (FEAT-002): the structural wiring (registerCommand,
// onDidChangeConfiguration, subscriptions.push) is present so the extension
// compiles and bundles, but the command bodies stay `// TODO`. The injected
// `controller` is therefore not consumed yet, and the configuration guard uses
// an early return whose following body is still a TODO. Remove this directive
// once the command handlers are implemented.

import * as vscode from 'vscode';
import { EntityMapBuilder } from './core/EntityMapBuilder';
import { CommandController } from './adapters/CommandController';
import { VscodeConfigurationProvider } from './adapters/VscodeConfigurationProvider';

/** Configuration section watched for override changes. */
const CONFIGURATION_SECTION = 'htmlentityswaper';
/** Command id replacing characters in the whole document. */
const COMMAND_REPLACE_IN_DOCUMENT = 'htmlentityswaper.replaceInDocument';
/** Command id replacing characters within the current selection. */
const COMMAND_REPLACE_IN_SELECTION = 'htmlentityswaper.replaceInSelection';

/**
 * Activate the extension: wire dependencies, register the two commands and the
 * configuration listener, and push every disposable into the subscriptions.
 *
 * Dependency injection is performed here (composition root): the configuration
 * provider and the controller are instantiated and connected. Listening to
 * `onDidChangeConfiguration` lets the entity map be rebuilt on demand, removing
 * the reference extension's "reload required" limitation.
 * @param context The extension context owning the disposables.
 */
export function activate(context: vscode.ExtensionContext): void {
  const configurationProvider = new VscodeConfigurationProvider();
  const controller = new CommandController(configurationProvider, () => new EntityMapBuilder());

  const replaceInDocument = vscode.commands.registerCommand(
    COMMAND_REPLACE_IN_DOCUMENT,
    async (): Promise<void> => {
      // TODO: guard on an active editor, then controller.replaceInDocument(editor).
      throw new Error('Not implemented');
    },
  );

  const replaceInSelection = vscode.commands.registerCommand(
    COMMAND_REPLACE_IN_SELECTION,
    async (): Promise<void> => {
      // TODO: guard on an active editor, then controller.replaceInSelection(editor).
      throw new Error('Not implemented');
    },
  );

  const configurationListener = vscode.workspace.onDidChangeConfiguration(
    (event: vscode.ConfigurationChangeEvent): void => {
      if (!event.affectsConfiguration(CONFIGURATION_SECTION)) {
        return;
      }
      // TODO: invalidate any cached entity map so the next command rebuilds it.
    },
  );

  context.subscriptions.push(replaceInDocument, replaceInSelection, configurationListener);
}

/**
 * Deactivate the extension. No manual cleanup is required: every disposable was
 * registered in `context.subscriptions` and is released by the host.
 */
export function deactivate(): void {
  // Intentionally empty.
}
