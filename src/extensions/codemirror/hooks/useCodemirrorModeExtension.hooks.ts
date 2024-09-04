import {
    syntaxHighlighting,
    defaultHighlightStyle,
    StreamLanguage,
    StreamParser,
    LanguageSupport,
} from "@codemirror/language";

//modes imports
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { javascript } from "@codemirror/legacy-modes/mode/javascript";
import { python } from "@codemirror/legacy-modes/mode/python";
import { sparql } from "@codemirror/legacy-modes/mode/sparql";
import { sql } from "@codemirror/legacy-modes/mode/sql";
import { turtle } from "@codemirror/legacy-modes/mode/turtle";
import { jinja2 } from "@codemirror/legacy-modes/mode/jinja2";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import { ntriples } from "@codemirror/legacy-modes/mode/ntriples";
import { mathematica } from "@codemirror/legacy-modes/mode/mathematica";

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
        ? syntaxHighlighting(defaultHighlightStyle)
        : ["json", "markdown", "xml"].includes(mode)
        ? (supportedModes[mode] as () => LanguageSupport)()
        : StreamLanguage.define(supportedModes[mode] as StreamParser<unknown>);
};
