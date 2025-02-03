import { Diagnostic } from "@codemirror/lint";
import { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

export type Linter = (view: EditorView) => ReadonlyArray<Diagnostic> | Promise<ReadonlyArray<Diagnostic>>;

export type ExtensionCreator<T = unknown> = (options?: T) => Extension;
