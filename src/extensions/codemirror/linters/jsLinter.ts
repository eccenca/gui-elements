import { Diagnostic, linter } from "@codemirror/lint";
import { JSHINT as jshint } from "jshint";

import { ExtensionCreator } from "../types";

const lintOptions = {
    esversion: 11,
    browser: true,
};

/**
 * Sets up the javascript linter. Documentation: https://codemirror.net/examples/lint/
 */
export const jsLinter: ExtensionCreator = () => {
    return linter((view) => {
        const diagnostics: Array<Diagnostic> = [];
        const codeText = view.state.doc.toJSON();
        jshint(codeText, lintOptions);
        const errors = jshint?.data()?.errors;

        if (errors && errors.length > 0) {
            errors.forEach((error) => {
                const selectedLine = view.state.doc.line(error.line);

                const diagnostic: Diagnostic = {
                    from: selectedLine.from,
                    to: selectedLine.to,
                    severity: "error",
                    message: error.reason,
                };

                diagnostics.push(diagnostic);
            });
        }

        return diagnostics;
    });
};
