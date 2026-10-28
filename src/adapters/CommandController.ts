/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
// Scaffold stub (FEAT-002): method bodies are not implemented yet, so injected
// collaborators and parameters are staged but unused and methods do not yet
// reference `this`. Remove this directive once the orchestration logic lands.

import * as vscode from 'vscode';
import type { IConfigurationProvider } from '../core/ports/IConfigurationProvider';
import { EntityMapBuilder } from '../core/EntityMapBuilder';
import { EntityReplacer } from '../core/EntityReplacer';
import { VscodeDocumentAdapter } from './VscodeDocumentAdapter';

/**
 * Orchestrates the replacement commands on top of the pure core.
 *
 * The controller is injected with an {@link IConfigurationProvider} and an
 * {@link EntityMapBuilder} factory so it can (re)build the entity map on demand
 * rather than at module load time. It reads the active document/selection via
 * {@link VscodeDocumentAdapter}, delegates the pure computation to
 * {@link EntityReplacer}, then applies every edit as a SINGLE grouped
 * `vscode.WorkspaceEdit`.
 *
 * Grouping all edits into one `WorkspaceEdit` fixes the reference behaviour
 * (one edit per character), giving a single undo step and better performance.
 */
export class CommandController {
  private readonly configurationProvider: IConfigurationProvider;

  private readonly createBuilder: () => EntityMapBuilder;

  /**
   * @param configurationProvider Source of the user override table.
   * @param createBuilder Factory returning a fresh {@link EntityMapBuilder}, so
   *   the map can be rebuilt whenever configuration changes.
   */
  public constructor(
    configurationProvider: IConfigurationProvider,
    createBuilder: () => EntityMapBuilder,
  ) {
    this.configurationProvider = configurationProvider;
    this.createBuilder = createBuilder;
  }

  /**
   * Replace every mappable character in the whole document.
   * @param editor The active editor whose document is processed.
   */
  public async replaceInDocument(editor: vscode.TextEditor): Promise<void> {
    // TODO: build map, adapt document, compute replacements over the full text,
    // and apply them as a single grouped WorkspaceEdit.
    throw new Error('Not implemented');
  }

  /**
   * Replace every mappable character within the current selection.
   * @param editor The active editor whose selection is processed.
   */
  public async replaceInSelection(editor: vscode.TextEditor): Promise<void> {
    // TODO: build map, adapt document, compute replacements limited to the
    // selection range, and apply them as a single grouped WorkspaceEdit.
    throw new Error('Not implemented');
  }

  /**
   * Build a fresh replacer from the current defaults + overrides.
   * @returns A replacer bound to a newly built entity map.
   */
  private buildReplacer(): EntityReplacer {
    // TODO: this.createBuilder().withDefaults()
    //   .withOverrides(this.configurationProvider.getOverrides()).build().
    throw new Error('Not implemented');
  }
}
