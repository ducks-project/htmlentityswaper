import type { IConfigurationProvider } from '../core/ports/IConfigurationProvider';
import type { ReplacementResult } from '../core/models/ReplacementResult';
import type { Replacement } from '../core/models/Replacement';
import type { IReplacementEditor } from './ports/IReplacementEditor';
import type { IInfoMessageSink } from './ports/IInfoMessageSink';
import { EntityMapBuilder } from '../core/EntityMapBuilder';
import { EntityReplacer } from '../core/EntityReplacer';

/** Count below which no edit is applied (avoids an empty grouped edit). */
const EMPTY_RESULT_COUNT = 0;

/** Information message shown when a command has nothing to replace. */
const MESSAGE_NOTHING_TO_REPLACE = 'No characters to replace.';

/**
 * Order replacements from last to first by absolute offset.
 *
 * Applying edits last-to-first guarantees an earlier replacement never shifts
 * the offsets of a later one, so the whole batch can be applied as one grouped
 * edit. The input is never mutated: a defensive copy is sorted and returned.
 * @param result The computed replacements to order.
 * @returns A new array of replacements ordered last-to-first.
 */
function orderLastToFirst(result: ReplacementResult): readonly Replacement[] {
  return [...result.edits].sort((left, right) => right.position - left.position);
}

/**
 * Orchestrates the replacement commands on top of the pure core.
 *
 * The controller is injected with an {@link IConfigurationProvider}, an
 * {@link EntityMapBuilder} factory, and an {@link IInfoMessageSink}, so it can
 * (re)build the entity map on demand and surface the no-op message without ever
 * importing the `vscode` namespace (Dependency Inversion). It reads the active
 * document/selection through the injected {@link IReplacementEditor}, delegates
 * the pure computation to {@link EntityReplacer}, then applies every edit as a
 * SINGLE grouped edit via {@link IReplacementEditor.applyGroupedEdit}.
 *
 * Grouping all edits into one operation fixes the reference behaviour (one edit
 * per character), giving a single undo step and better performance.
 */
export class CommandController {
  private readonly configurationProvider: IConfigurationProvider;

  private readonly createBuilder: () => EntityMapBuilder;

  private readonly infoMessageSink: IInfoMessageSink;

  /**
   * @param configurationProvider Source of the user override table.
   * @param createBuilder Factory returning a fresh {@link EntityMapBuilder}, so
   *   the map can be rebuilt whenever configuration changes.
   * @param infoMessageSink Surface for the no-op information message.
   */
  public constructor(
    configurationProvider: IConfigurationProvider,
    createBuilder: () => EntityMapBuilder,
    infoMessageSink: IInfoMessageSink,
  ) {
    this.configurationProvider = configurationProvider;
    this.createBuilder = createBuilder;
    this.infoMessageSink = infoMessageSink;
  }

  /**
   * Replace every mappable character in the whole document.
   * @param editor The active editor whose document is processed.
   */
  public async replaceInDocument(editor: IReplacementEditor): Promise<void> {
    const result = this.buildReplacer().computeReplacements(editor.getDocument());
    await this.applyGroupedEdit(editor, result);
  }

  /**
   * Replace every mappable character within the current selection.
   * @param editor The active editor whose selection is processed.
   */
  public async replaceInSelection(editor: IReplacementEditor): Promise<void> {
    const selection = editor.getSelection();
    if (selection.isEmpty()) {
      // An empty selection yields zero replacements, so it is treated as the
      // same "nothing to replace" no-op as a selection with no mappable
      // character and surfaces the same information message.
      this.infoMessageSink.showInfo(MESSAGE_NOTHING_TO_REPLACE);
      return;
    }
    const result = this.buildReplacer().computeReplacements(
      editor.getDocument(),
      selection.toRange(),
    );
    await this.applyGroupedEdit(editor, result);
  }

  /**
   * Apply a replacement result as a single grouped edit, or surface the no-op
   * information message when there is nothing to replace.
   *
   * Edits are ordered last-to-first before being handed to the editor so an
   * earlier replacement never shifts the offsets of a later one; the whole
   * batch is applied as ONE grouped edit, reversible by a single undo.
   * @param editor The active editor the edit is applied to.
   * @param result The computed replacements.
   */
  private async applyGroupedEdit(
    editor: IReplacementEditor,
    result: ReplacementResult,
  ): Promise<void> {
    if (EMPTY_RESULT_COUNT === result.count) {
      this.infoMessageSink.showInfo(MESSAGE_NOTHING_TO_REPLACE);
      return;
    }
    await editor.applyGroupedEdit(orderLastToFirst(result));
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
