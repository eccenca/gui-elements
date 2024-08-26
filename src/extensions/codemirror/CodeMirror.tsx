import React, { TextareaHTMLAttributes, useRef } from "react";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import {
    StreamLanguage,
    StreamParser,
    foldGutter,
    codeFolding,
    foldKeymap,
    syntaxHighlighting,
    defaultHighlightStyle,
} from "@codemirror/language";
import {
    EditorView,
    keymap,
    lineNumbers,
    highlightSpecialChars,
    highlightActiveLine,
    DOMEventHandlers,
} from "@codemirror/view";
import { basicSetup } from "codemirror";

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

//theme
import { githubLight } from "@uiw/codemirror-theme-github";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
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

export interface CodeEditorProps {
    // Is called with the editor instance that allows access via the CodeMirror API
    setEditorView?: (editor: EditorView | null) => any;
    /**
     * `name` attribute of connected textarea element.
     */
    name: string;
    /**
     * `id` attribute of connected textarea element.
     * If not set then the default value is created by `codemirror-${name-attribute}`.
     */
    id?: string;
    /**
     * Handler method to receive onChange events.
     * As input the new value is given.
     */
    onChange?: (v: any) => void;
    /**
     * Syntax mode of the code editor.
     */
    mode?: SupportedCodeEditorModes;
    /**
     * Default value used first when the editor is instanciated.
     */
    defaultValue?: any;
    /**
     * If enabled the code editor won't show numbers before each line.
     */
    preventLineNumbers?: boolean;

    /** Set read-only mode. Default: false */
    readOnly?: boolean;

    /** Optional height of the component */
    height?: number | string;

    /** Long lines are wrapped and displayed on multiple lines */
    wrapLines?: boolean;

    outerDivAttributes?: Partial<TextareaHTMLAttributes<HTMLDivElement>>;

    /**
     * Size in spaces that is used for a tabulator key.
     */
    tabIntentSize?: number;

    /**
     * Set the char type that is used for the tabulator key.
     * If set to `space` the a number of `tabIntentSize` spaces is used instead of a tab.
     */
    tabIntentStyle?: "tab" | "space";

    /**
     * For some modes an indent style with `space` can be forced, even if `tabIntentStyle="tab"` is set.
     */
    tabForceSpaceForModes?: SupportedCodeEditorModes[];

    /**
     *  handler for scroll event
     */
    onScroll?: (event: Event, view: EditorView) => boolean | void;
    /**
     * optional property to fold code for the supported modes e.g: xml, json etc.
     */
    supportCodeFolding?: boolean;
}

/**
 * Includes a code editor, currently we use CodeMirror library as base.
 */
export const CodeEditor = ({
    onChange,
    // name,
    id,
    mode,
    preventLineNumbers = false,
    defaultValue = "",
    readOnly = false,
    // height,
    wrapLines = false,
    onScroll,
    setEditorView,
    supportCodeFolding = false,
    outerDivAttributes,
    tabIntentSize = 2,
    tabIntentStyle = "tab",
    tabForceSpaceForModes = ["python", "yaml"],
}: CodeEditorProps) => {
    const parent = useRef<any>(undefined);

    React.useEffect(() => {
        const keyMapConfigs = [defaultKeymap as any];
        const domEventHandlers = {} as DOMEventHandlers<any>;
        const extensions = [
            githubLight,
            basicSetup,
            highlightSpecialChars(),
            highlightActiveLine(),
            !mode
                ? syntaxHighlighting(defaultHighlightStyle)
                : ["json", "markdown", "xml"].includes(mode)
                ? (supportedModes[mode] as any)() //todo correct typing later
                : StreamLanguage.define(supportedModes[mode] as StreamParser<unknown>),
            keymap.of(keyMapConfigs),
            EditorState.tabSize.of(tabIntentSize),
            EditorState.readOnly.of(readOnly),
            EditorView.domEventHandlers(domEventHandlers),
        ]; //will fix key binding error later

        if (!preventLineNumbers) {
            extensions.push(lineNumbers());
        }

        if (wrapLines) {
            extensions.push(EditorView.lineWrapping);
        }

        if (supportCodeFolding) {
            extensions.concat([foldGutter(), codeFolding()]);
            keyMapConfigs.push(foldKeymap);
        }

        if (tabIntentStyle === "tab" && mode && !(tabForceSpaceForModes ?? []).includes(mode)) {
            keyMapConfigs.push(indentWithTab);
        }

        if (onScroll) {
            domEventHandlers.scroll = onScroll;
        }

        if (onChange) {
            domEventHandlers.change = (_, cm: EditorView) => {
                onChange(cm.state.doc.toString());
            };
        }

        const view = new EditorView({
            state: EditorState.create({
                doc: defaultValue,
                extensions,
            }),
            parent: parent.current,
        });

        setEditorView && setEditorView(view);

        return () => {
            view.destroy();
            setEditorView && setEditorView(null);
        };
    }, [parent.current, mode, preventLineNumbers]);

    return (
        <div
            {...outerDivAttributes}
            id={id}
            ref={parent}
            className={`${eccgui}-codeeditor ${eccgui}-codeeditor--mode-${mode}`}
        />
    );
};
