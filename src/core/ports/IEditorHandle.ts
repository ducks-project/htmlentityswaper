/**
 * Port (Dependency Inversion) abstracting the opaque active-editor handle the
 * command runner passes to a command body.
 *
 * The handle is intentionally shapeless (Interface Segregation): the runner
 * only needs an object to forward to the body and never inspects it, so this
 * contract carries no member and leaks no `vscode` type. A concrete adapter
 * (for example a `vscode`-backed accessor) supplies a real editor as this
 * handle, keeping the runner host-agnostic and unit-testable without an editor.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEditorHandle {}
