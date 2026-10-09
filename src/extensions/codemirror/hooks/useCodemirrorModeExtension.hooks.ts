//adapted v6 modes imports
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { defaultHighlightStyle, StreamLanguage, StreamParser } from "@codemirror/language";
//legacy mode imports
import { jinja2 } from "@codemirror/legacy-modes/mode/jinja2";
import { mathematica } from "@codemirror/legacy-modes/mode/mathematica";
import { ntriples } from "@codemirror/legacy-modes/mode/ntriples";
import { python } from "@codemirror/legacy-modes/mode/python";
import { sparql } from "@codemirror/legacy-modes/mode/sparql";
import { turtle } from "@codemirror/legacy-modes/mode/turtle";

//adaptations
import { adaptedSyntaxHighlighting } from "../tests/codemirrorTestHelper";

const supportedModes = {
    markdown,
    python,
    sparql,
    turtle,
    xml,
    yaml,
    jinja2,
    json,
    ntriples,
    mathematica,
    sql,
    javascript,
    html,
} as const;

export const supportedCodeEditorModes = Object.keys(supportedModes) as Array<keyof typeof supportedModes>;
export type SupportedCodeEditorModes = (typeof supportedCodeEditorModes)[number];

export const useCodeMirrorModeExtension = (mode?: SupportedCodeEditorModes) => {
    if (!mode) return adaptedSyntaxHighlighting(defaultHighlightStyle);
    const language = supportedModes[mode];
    // Legacy-mode declarations reference ESM CodeMirror types even for their CommonJS entry.
    // Both entries implement the same parser contract, but StringStream has private members.
    return typeof language === "function"
        ? language()
        : StreamLanguage.define(language as unknown as StreamParser<unknown>);
};
