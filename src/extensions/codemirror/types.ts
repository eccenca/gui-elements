import { Diagnostic } from "@codemirror/lint";
import { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

export type Linter = (view: EditorView) => ReadonlyArray<Diagnostic> | Promise<ReadonlyArray<Diagnostic>>;

export enum EditorMode {
    Turtle = "turtle",
    SPARQL = "sparql",
    JavaScript = "javascript",
}

export type ExtensionCreator<T = unknown> = (options?: T) => Extension;
