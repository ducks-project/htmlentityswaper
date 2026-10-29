/**
 * Port (Dependency Inversion) surfacing informational, non-error messages to
 * the host, decoupled from the `vscode` namespace.
 *
 * The contract is intentionally minimal (Interface Segregation) and distinct
 * from the error-only {@link IMessageSink}: the controller only needs to inform
 * the user that a command had nothing to replace. In production a thin
 * `vscode`-backed adapter forwards to `vscode.window.showInformationMessage`; at
 * test time a test double records the surfaced text, so the no-op paths are
 * exercisable without a host.
 */
export interface IInfoMessageSink {
  /**
   * Surface an informational message to the user.
   * @param message The information text to display.
   */
  showInfo(message: string): void;
}
