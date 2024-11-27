import { Diagnostic } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { debounce } from "lodash";

import { Linter } from "./types";

const DEBOUNCE_TIME = 500;

export const debouncedLinter = (lintFunction: Linter, time = DEBOUNCE_TIME) => {
    const debouncedFn = debounce(
        (
            view: EditorView,
            resolve: (diagnostics: ReadonlyArray<Diagnostic> | Promise<ReadonlyArray<Diagnostic>>) => void
        ) => {
            const diagnostics = lintFunction(view);
            resolve(diagnostics);
        },
        time
    );

    return (view: EditorView) => {
        return new Promise<ReadonlyArray<Diagnostic>>((resolve) => {
            debouncedFn(view, resolve);
        });
    };
};
