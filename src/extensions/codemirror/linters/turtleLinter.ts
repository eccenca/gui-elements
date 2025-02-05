import { Diagnostic, linter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { Parser } from "n3";

import { debouncedLinter } from "../debouncedLinter";
import { ExtensionCreator, Linter } from "../types";

const parser = new Parser();

const EMPTY_RESOURCE = "<>";

const getError = (message: string, view: EditorView) => {
    const lineMatch = message.match(/(?<=line )\d{1,}/);
    const valueMatch = message.match(/"([^"]*)"/);

    const lineNumber = lineMatch ? Number(lineMatch[0]) : 1;
    // the [1] index is used to get the caputre group
    const errorContent = valueMatch && valueMatch[1];

    const line = view.state.doc.line(lineNumber);
    const position = line.text.search(errorContent ?? /\S/);

    const from = line.from + position;
    const errorLength = errorContent?.length;

    return { from, to: errorLength ? from + errorLength : line.to };
};

const getQuadError = (view: EditorView) => {
    const lines = view.state.doc.toJSON();

    for (let i = 0; i < lines.length; i += 1) {
        const input = lines[i].trim();

        if (!input) {
            continue;
        }

        if (input.includes(EMPTY_RESOURCE)) {
            // i + 1 is used here because the codemirror uses 1-indexes
            const line = view.state.doc.line(i + 1);
            const position = line.text.search(EMPTY_RESOURCE);

            const from = line.from + position;

            return {
                from,
                to: from + EMPTY_RESOURCE.length,
            };
        }
    }

    return { from: 0, to: view.state.doc.length };
};

const n3Linter: Linter = (view) => {
    const diagnostics: Array<Diagnostic> = [];
    const value = view.state.doc.toString();

    try {
        const quads = parser.parse(value);

        quads.forEach((quad) => {
            if (!quad.subject || !quad.predicate || !quad.object) {
                const { from, to } = getQuadError(view);

                view.dispatch({
                    scrollIntoView: true,
                });

                diagnostics.push({
                    from,
                    to,
                    severity: "error",
                    message: `Invalid RDF quad:\n\nsubject: ${quad.subject}\npredicate: ${quad.predicate}\nobject: ${quad.object}`,
                });
            }
        });
    } catch (error) {
        const { message } = error as Error;

        const { from, to } = getError(message, view);

        view.dispatch({
            scrollIntoView: true,
        });

        diagnostics.push({
            from,
            to,
            severity: "error",
            message: (error as Error).message,
        });
    }

    return diagnostics;
};

/**
 * Sets up the turtle linter. Documentation: https://codemirror.net/examples/lint/
 */
export const turtleLinter: ExtensionCreator = () => linter(debouncedLinter(n3Linter));
