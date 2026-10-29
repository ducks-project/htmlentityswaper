import type { IMessageSink } from '../../src/adapters/ports/IMessageSink';

/**
 * Test double conforming to the full {@link IMessageSink} contract.
 *
 * It records every surfaced message so a test can assert both the surfaced
 * text and how many times the sink was called, without a real `vscode` host.
 */
export class RecordingMessageSink implements IMessageSink {
  public readonly errors: string[] = [];

  /**
   * Record an error message surfaced by the runner.
   * @param message The error text to display.
   */
  public showError(message: string): void {
    this.errors.push(message);
  }
}
