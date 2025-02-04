import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
//modes imports
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { defaultHighlightStyle, LanguageSupport, StreamLanguage, StreamParser } from "@codemirror/language";
import { jinja2 } from "@codemirror/legacy-modes/mode/jinja2";
import { mathematica } from "@codemirror/legacy-modes/mode/mathematica";
import { ntriples } from "@codemirror/legacy-modes/mode/ntriples";
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
} as const;

const v6AdaptedModes = new Map([
    ["json", true],
    ["markdown", true],
    ["xml", true],
    ["sql", true],
    ["yaml", true],
    ["python", true],
    ["javascript", true],
]);
export const supportedCodeEditorModes = Object.keys(supportedModes) as Array<keyof typeof supportedModes>;
export type SupportedCodeEditorModes = (typeof supportedCodeEditorModes)[number];

export const useCodeMirrorModeExtension = (mode?: SupportedCodeEditorModes) => {
    return !mode
        ? adaptedSyntaxHighlighting(defaultHighlightStyle)
        : v6AdaptedModes.has(mode)
        ? ((typeof supportedModes[mode] === "function" ? supportedModes[mode] : () => {}) as () => LanguageSupport)()
        : StreamLanguage?.define(supportedModes[mode] as StreamParser<unknown>);
};
