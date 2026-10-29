import * as vscode from 'vscode';
import type { IInfoMessageSink } from './ports/IInfoMessageSink';

/**
 * Adapter implementing {@link IInfoMessageSink} on top of
 * `vscode.window.showInformationMessage`.
 *
 * It confines the informational-message surface to a thin shell so the
 * {@link CommandController} no-op path never imports the `vscode` namespace. The
 * returned thenable is intentionally detached (fire-and-forget): the controller
 * only needs the message surfaced, not the dismissal outcome.
 */
export class VscodeInfoMessageSink implements IInfoMessageSink {
  /**
   * Surface an informational message through the VS Code information surface.
   * @param message The information text to display.
   */
  // This method implements an instance contract but forwards only to the global
  // `vscode.window` surface, so it legitimately does not reference `this`.
  // eslint-disable-next-line class-methods-use-this
  public showInfo(message: string): void {
    vscode.window.showInformationMessage(message).then(undefined, undefined);
  }
}
