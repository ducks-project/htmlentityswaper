import { expect } from 'chai';

import { CommandRunner } from '../../src/adapters/CommandRunner';
import type { IEditorHandle } from '../../src/core/ports/IEditorHandle';
import { RecordingMessageSink } from '../helpers/recording-message-sink';
import { StubActiveEditorAccessor } from '../helpers/stub-active-editor-accessor';

/** Message surfaced by the runner when no editor is active. */
const MESSAGE_NO_ACTIVE_EDITOR = 'No active editor.';

/** Prefix the runner prepends to a wrapped command-body failure. */
const ERROR_MESSAGE_PREFIX = 'HTML Entity Swapper: ';

/**
 * Behaviour specification for {@link CommandRunner}.
 *
 * Exercises the three control-flow paths of `withActiveEditor`: the no-editor
 * guard, the thrown-body error wrapper, and the happy path. Both collaborators
 * are driven through test doubles conforming to the full {@link
 * StubActiveEditorAccessor} and {@link RecordingMessageSink} port contracts.
 */
describe('CommandRunner', () => {
  it('surfaces "No active editor." and skips the body when no editor is active', async () => {
    const accessor = new StubActiveEditorAccessor(undefined);
    const sink = new RecordingMessageSink();
    const runner = new CommandRunner(accessor, sink);
    let bodyInvoked = false;

    await runner.withActiveEditor(() => {
      bodyInvoked = true;
    });

    expect(bodyInvoked).to.equal(false);
    expect(sink.errors).to.deep.equal([MESSAGE_NO_ACTIVE_EDITOR]);
  });

  it('runs the body exactly once with the active editor on the happy path', async () => {
    const handle: IEditorHandle = {};
    const accessor = new StubActiveEditorAccessor(handle);
    const sink = new RecordingMessageSink();
    const runner = new CommandRunner(accessor, sink);
    const received: IEditorHandle[] = [];

    await runner.withActiveEditor((editor) => {
      received.push(editor);
    });

    expect(received).to.have.lengthOf(1);
    expect(received[0]).to.equal(handle);
    expect(sink.errors).to.deep.equal([]);
  });

  it('wraps a thrown Error with the extension prefix via the sink', async () => {
    const accessor = new StubActiveEditorAccessor({});
    const sink = new RecordingMessageSink();
    const runner = new CommandRunner(accessor, sink);

    await runner.withActiveEditor(() => {
      throw new Error('boom');
    });

    expect(sink.errors).to.deep.equal([`${ERROR_MESSAGE_PREFIX}boom`]);
  });

  it('wraps a thrown non-Error value by stringifying it via the sink', async () => {
    const accessor = new StubActiveEditorAccessor({});
    const sink = new RecordingMessageSink();
    const runner = new CommandRunner(accessor, sink);

    await runner.withActiveEditor(() => {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw 'plain string failure';
    });

    expect(sink.errors).to.deep.equal([`${ERROR_MESSAGE_PREFIX}plain string failure`]);
  });

  it('wraps a rejected asynchronous body failure via the sink', async () => {
    const accessor = new StubActiveEditorAccessor({});
    const sink = new RecordingMessageSink();
    const runner = new CommandRunner(accessor, sink);

    await runner.withActiveEditor(async () => {
      throw new Error('async boom');
    });

    expect(sink.errors).to.deep.equal([`${ERROR_MESSAGE_PREFIX}async boom`]);
  });
});
