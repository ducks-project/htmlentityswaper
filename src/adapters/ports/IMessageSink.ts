/**
 * Port (Dependency Inversion) surfacing user-facing messages to the host,
 * decoupled from the `vscode` namespace.
 *
 * The contract is intentionally minimal (Interface Segregation): the command
 * runner only needs to surface an error message when a command body fails. In
 * production a thin `vscode`-backed adapter forwards to
 * `vscode.window.showErrorMessage`; at test time a test double records the
 * surfaced text, so the error-wrapping path is exercisable without a host.
 */
export interface IMessageSink {
  /**
   * Surface an error message to the user.
   * @param message The error text to display.
   */
  showError(message: string): void;
}
