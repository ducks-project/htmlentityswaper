import { expect } from 'chai';

import { CommandController } from '../../src/adapters/CommandController';
import { EntityMapBuilder } from '../../src/core/EntityMapBuilder';
import type { IReplacementRange } from '../../src/core/EntityReplacer';
import type { Replacement } from '../../src/core/models/Replacement';
import { FakeDocument } from '../helpers/fake-document';
import { FakeActiveSelection } from '../helpers/fake-active-selection';
import { FakeReplacementEditor } from '../helpers/fake-replacement-editor';
import { RecordingInfoMessageSink } from '../helpers/recording-info-message-sink';
import { StubConfigurationProvider } from '../helpers/stub-configuration-provider';

/** Information message surfaced when a command has nothing to replace. */
const MESSAGE_NOTHING_TO_REPLACE = 'No characters to replace.';

/** Expected number of grouped-edit applications for a single undo step. */
const SINGLE_GROUPED_EDIT = 1;

/** A range covering the whole single-line document used by the grouped test. */
const WHOLE_LINE_RANGE: IReplacementRange = {
  startLine: 0,
  startCharacter: 0,
  endLine: 0,
  endCharacter: Number.MAX_SAFE_INTEGER,
};

/** An empty selection range (start equal to end), for the no-op selection path. */
const EMPTY_RANGE: IReplacementRange = {
  startLine: 0,
  startCharacter: 0,
  endLine: 0,
  endCharacter: 0,
};

/** The single character the override test maps, absent from the default table. */
const OVERRIDDEN_CHARACTER = '"';

/** Document holding exactly one overridden character, for the pickup test. */
const SINGLE_OVERRIDDEN_CHARACTER_TEXT = '"';

/** Initial entity the first invocation should apply for the overridden character. */
const INITIAL_OVERRIDE_ENTITY = '&quot;';

/** Replacement entity the second invocation should apply after mutation. */
const UPDATED_OVERRIDE_ENTITY = '&#34;';

/** Index of the only replacement expected in each single-character batch. */
const ONLY_REPLACEMENT = 0;

/**
 * Build a controller wired to a stub configuration provider, the default
 * entity-map builder factory, and a recording information sink.
 * @param sink The recording sink to assert surfaced messages against.
 * @param overrides Optional override table for the stub provider.
 * @returns A controller driven entirely by test doubles.
 */
function controllerWith(
  sink: RecordingInfoMessageSink,
  overrides: Readonly<Record<string, string>> = {},
): CommandController {
  return new CommandController(
    new StubConfigurationProvider(overrides),
    () => new EntityMapBuilder(),
    sink,
  );
}

/**
 * Behaviour specification for {@link CommandController}.
 *
 * Exercises the two command behaviours through test doubles conforming to the
 * full `IConfigurationProvider`, `IInfoMessageSink`, `IReplacementEditor`, and
 * `IActiveSelection` contracts (no duck-typing): the two `No characters to
 * replace.` no-op paths and the single grouped-edit guarantee.
 */
describe('CommandController', () => {
  it('surfaces "No characters to replace." and applies no edit on zero mappable characters', async () => {
    const sink = new RecordingInfoMessageSink();
    const controller = controllerWith(sink);
    const editor = new FakeReplacementEditor(
      new FakeDocument('abc 123'),
      new FakeActiveSelection(false, WHOLE_LINE_RANGE),
    );

    await controller.replaceInDocument(editor);

    expect(sink.messages).to.deep.equal([MESSAGE_NOTHING_TO_REPLACE]);
    expect(editor.appliedBatches).to.have.lengthOf(0);
  });

  it('surfaces "No characters to replace." and applies no edit on an empty selection', async () => {
    const sink = new RecordingInfoMessageSink();
    const controller = controllerWith(sink);
    const editor = new FakeReplacementEditor(
      new FakeDocument('café'),
      new FakeActiveSelection(true, EMPTY_RANGE),
    );

    await controller.replaceInSelection(editor);

    expect(sink.messages).to.deep.equal([MESSAGE_NOTHING_TO_REPLACE]);
    expect(editor.appliedBatches).to.have.lengthOf(0);
  });

  it('applies every edit as a single grouped edit ordered last-to-first', async () => {
    const sink = new RecordingInfoMessageSink();
    const controller = controllerWith(sink);
    const editor = new FakeReplacementEditor(
      new FakeDocument('Café à la crème'),
      new FakeActiveSelection(false, WHOLE_LINE_RANGE),
    );

    await controller.replaceInDocument(editor);

    // Exactly one grouped apply happened: a single undo reverts the whole batch.
    expect(editor.appliedBatches).to.have.lengthOf(SINGLE_GROUPED_EDIT);
    expect(sink.messages).to.deep.equal([]);

    // "Café à la crème" maps é (offset 3), à (offset 5), è (offset 12).
    const [batch] = editor.appliedBatches;
    const positions = batch.map((replacement: Replacement) => replacement.position);
    expect(positions).to.deep.equal([12, 5, 3]);
    const originals = batch.map((replacement: Replacement) => replacement.original);
    expect(originals).to.deep.equal(['è', 'à', 'é']);
  });

  it('picks up changed overrides on the next invocation without a reload', async () => {
    // One controller is built with the provider seeded with an initial override
    // for a character absent from the default table, so every replacement seen
    // in a batch originates solely from the injected overrides.
    const sink = new RecordingInfoMessageSink();
    const configurationProvider = new StubConfigurationProvider({
      [OVERRIDDEN_CHARACTER]: INITIAL_OVERRIDE_ENTITY,
    });
    const controller = new CommandController(
      configurationProvider,
      () => new EntityMapBuilder(),
      sink,
    );

    // First invocation applies the initial override.
    const firstEditor = new FakeReplacementEditor(
      new FakeDocument(SINGLE_OVERRIDDEN_CHARACTER_TEXT),
      new FakeActiveSelection(false, WHOLE_LINE_RANGE),
    );
    await controller.replaceInDocument(firstEditor);

    expect(firstEditor.appliedBatches).to.have.lengthOf(SINGLE_GROUPED_EDIT);
    const [firstBatch] = firstEditor.appliedBatches;
    expect(firstBatch[ONLY_REPLACEMENT].original).to.equal(OVERRIDDEN_CHARACTER);
    expect(firstBatch[ONLY_REPLACEMENT].replacement).to.equal(INITIAL_OVERRIDE_ENTITY);

    // Mutate the provider to a DIFFERENT mapping WITHOUT rebuilding the controller.
    configurationProvider.setOverrides({
      [OVERRIDDEN_CHARACTER]: UPDATED_OVERRIDE_ENTITY,
    });

    // Second invocation on fresh input reflects the NEW override, proving the
    // controller rebuilds the entity map per call rather than caching it.
    const secondEditor = new FakeReplacementEditor(
      new FakeDocument(SINGLE_OVERRIDDEN_CHARACTER_TEXT),
      new FakeActiveSelection(false, WHOLE_LINE_RANGE),
    );
    await controller.replaceInDocument(secondEditor);

    expect(secondEditor.appliedBatches).to.have.lengthOf(SINGLE_GROUPED_EDIT);
    const [secondBatch] = secondEditor.appliedBatches;
    expect(secondBatch[ONLY_REPLACEMENT].original).to.equal(OVERRIDDEN_CHARACTER);
    expect(secondBatch[ONLY_REPLACEMENT].replacement).to.equal(UPDATED_OVERRIDE_ENTITY);
  });
});
