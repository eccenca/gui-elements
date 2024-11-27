import { json } from "@codemirror/lang-json";
//modes imports
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import { defaultHighlightStyle, LanguageSupport, StreamLanguage, StreamParser } from "@codemirror/language";
import { javascript } from "@codemirror/legacy-modes/mode/javascript";
import { jinja2 } from "@codemirror/legacy-modes/mode/jinja2";
import { mathematica } from "@codemirror/legacy-modes/mode/mathematica";
import { ntriples } from "@codemirror/legacy-modes/mode/ntriples";
import { python } from "@codemirror/legacy-modes/mode/python";
import { sparql } from "@codemirror/legacy-modes/mode/sparql";
import { sql } from "@codemirror/legacy-modes/mode/sql";
import { turtle } from "@codemirror/legacy-modes/mode/turtle";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";

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

export const supportedCodeEditorModes = Object.keys(supportedModes) as Array<keyof typeof supportedModes>;
export type SupportedCodeEditorModes = (typeof supportedCodeEditorModes)[number];

export const useCodeMirrorModeExtension = (mode?: SupportedCodeEditorModes) => {
    return !mode
        ? adaptedSyntaxHighlighting(defaultHighlightStyle)
        : ["json", "markdown", "xml"].includes(mode)
        ? ((typeof supportedModes[mode] === "function" ? supportedModes[mode] : () => null) as () => LanguageSupport)()
        : StreamLanguage?.define(supportedModes[mode] as StreamParser<unknown>);
};
