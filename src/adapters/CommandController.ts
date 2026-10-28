import * as vscode from 'vscode';
import type { IConfigurationProvider } from '../core/ports/IConfigurationProvider';
import type { IReplacementRange } from '../core/EntityReplacer';
import type { ReplacementResult } from '../core/models/ReplacementResult';
import { EntityMapBuilder } from '../core/EntityMapBuilder';
import { EntityReplacer } from '../core/EntityReplacer';
import { VscodeDocumentAdapter } from './VscodeDocumentAdapter';

/** Count below which no edit is applied (avoids an empty WorkspaceEdit). */
const EMPTY_RESULT_COUNT = 0;

/** Information message shown when a command has nothing to replace. */
const MESSAGE_NOTHING_TO_REPLACE = 'No characters to replace.';

/**
 * Apply a replacement result to a document as a single grouped
 * `vscode.WorkspaceEdit` (one undo step). Edits are applied from last to first
 * so an earlier replacement never shifts the offsets of a later one. Absolute
 * UTF-16 offsets are converted to editor positions via `document.positionAt`.
 * @param document The document whose edits are applied.
 * @param result The computed replacements.
 */
async function applyGroupedEdit(
  document: vscode.TextDocument,
  result: ReplacementResult,
): Promise<void> {
  if (EMPTY_RESULT_COUNT === result.count) {
    await vscode.window.showInformationMessage(MESSAGE_NOTHING_TO_REPLACE);
    return;
  }
  const edit = new vscode.WorkspaceEdit();
  const ordered = [...result.edits].sort((left, right) => right.position - left.position);
  ordered.forEach((replacement) => {
    const range = new vscode.Range(
      document.positionAt(replacement.position),
      document.positionAt(replacement.position + replacement.length),
    );
    edit.replace(document.uri, range, replacement.replacement);
  });
  await vscode.workspace.applyEdit(edit);
}

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
    const result = this.buildReplacer().computeReplacements(
      new VscodeDocumentAdapter(editor.document),
    );
    await applyGroupedEdit(editor.document, result);
  }

  /**
   * Replace every mappable character within the current selection.
   * @param editor The active editor whose selection is processed.
   */
  public async replaceInSelection(editor: vscode.TextEditor): Promise<void> {
    const { selection } = editor;
    if (selection.isEmpty) {
      // An empty selection yields zero replacements, so it is treated as the
      // same "nothing to replace" no-op as a selection with no mappable
      // character and surfaces the same information message.
      await vscode.window.showInformationMessage(MESSAGE_NOTHING_TO_REPLACE);
      return;
    }
    const range: IReplacementRange = {
      startLine: selection.start.line,
      startCharacter: selection.start.character,
      endLine: selection.end.line,
      endCharacter: selection.end.character,
    };
    const result = this.buildReplacer().computeReplacements(
      new VscodeDocumentAdapter(editor.document),
      range,
    );
    await applyGroupedEdit(editor.document, result);
  }

  /**
   * Build a fresh replacer from the current defaults + overrides.
   * @returns A replacer bound to a newly built entity map.
   */
  private buildReplacer(): EntityReplacer {
    const entityMap = this.createBuilder()
      .withDefaults()
      .withOverrides(this.configurationProvider.getOverrides())
      .build();
    return new EntityReplacer(entityMap);
  }
}
