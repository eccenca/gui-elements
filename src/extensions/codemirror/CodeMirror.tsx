import React, { TextareaHTMLAttributes, useEffect, useRef } from "react";
import CodeMirror, { ModeSpec, ModeSpecOptions } from "codemirror";

import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/sparql/sparql.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/turtle/turtle.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/jinja2/jinja2.js";
import "codemirror/mode/yaml/yaml.js";
import "codemirror/mode/javascript/javascript.js";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export const supportedCodeEditorModes = [
    "markdown",
    "python",
    "sparql",
    "sql",
    "turtle",
    "xml",
    "jinja2",
    "yaml",
    "json",
    "undefined",
] as const;
type SupportedModesTuple = typeof supportedCodeEditorModes;
export type SupportedCodeEditorModes = SupportedModesTuple[number];

export interface CodeEditorProps {
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
    onChange: (v: any) => void;
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
}

/**
 * Includes a code editor, currently we use CodeMirror library as base.
 */
export const CodeEditor = ({
    onChange,
    name,
    id,
    mode = "undefined",
    preventLineNumbers = false,
    defaultValue,
    readOnly = false,
    height,
    wrapLines = false,
    outerDivAttributes,
    tabIntentSize = 2,
    tabIntentStyle = "tab",
    tabForceSpaceForModes = ["python", "yaml"],
}: CodeEditorProps) => {
    const domRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const editorInstance = CodeMirror.fromTextArea(domRef.current!, {
            mode: convertMode(mode),
            lineWrapping: wrapLines,
            lineNumbers: !preventLineNumbers,
            tabSize: tabIntentSize,
            indentUnit: tabIntentSize,
            indentWithTabs: tabIntentStyle === "tab" && !(tabForceSpaceForModes ?? []).includes(mode),
            theme: "xq-light",
            readOnly: readOnly,
            extraKeys: {
                Tab: function (cm) {
                    cm.execCommand(cm.getOption("indentWithTabs") ? "insertTab" : "insertSoftTab");
                },
            },
        });

        editorInstance.on("change", (api) => {
            onChange(api.getValue());
        });

        if (height) {
            editorInstance.setSize(null, height);
        }

        return function cleanup() {
            editorInstance.toTextArea();
        };
    }, [onChange, mode, preventLineNumbers]);

    return (
        <div {...outerDivAttributes} className={`${eccgui}-codeeditor`}>
            <textarea
                ref={domRef}
                /**
                 * FIXME: same `data-test-id` for multiple code editor elements are valid
                 * but may not make really sense for testing purposes. Currently let it
                 * unchanged from the code what was took over here.
                 */
                data-test-id="codemirror-wrapper"
                id={id ? id : `codemirror-${name}`}
                name={name}
                defaultValue={defaultValue}
            />
        </div>
    );
};

const convertMode = (mode: SupportedCodeEditorModes | undefined): string | ModeSpec<ModeSpecOptions> | undefined => {
    switch (mode) {
        case "undefined":
            return undefined;
        case "json":
            return {
                name: "javascript",
                json: true,
            };
        default:
            return mode;
    }
};
