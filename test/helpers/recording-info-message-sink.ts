import type { IInfoMessageSink } from '../../src/adapters/ports/IInfoMessageSink';

/**
 * Test double conforming to the full {@link IInfoMessageSink} contract.
 *
 * It records every surfaced information message so a test can assert both the
 * surfaced text and how many times the sink was called, without a real `vscode`
 * host.
 */
export class RecordingInfoMessageSink implements IInfoMessageSink {
  public readonly messages: string[] = [];

  /**
   * Record an information message surfaced by the controller.
   * @param message The information text to display.
   */
  public showInfo(message: string): void {
    this.messages.push(message);
  }
}
