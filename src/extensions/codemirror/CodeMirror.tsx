import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/sparql/sparql.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/turtle/turtle.js";
import "codemirror/mode/xml/xml.js";

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
    mode?: "markdown" | "python" | "sparql" | "sql" | "turtle" | "xml" | "undefined";
    /**
     * Default value used first when the editor is instanciated.
     */
    defaultValue?: any;
}

/**
 * Includes a code editor, currently we use CodeMirror library as base.
 */
export const CodeEditor = ({
    onChange,
    name,
    id,
    mode = "undefined",
    defaultValue
}: CodeEditorProps) => {
    const domRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const editorInstance = CodeMirror.fromTextArea(domRef.current!, {
            mode: mode === "undefined" ? undefined : mode,
            lineWrapping: true,
            lineNumbers: true,
            tabSize: 2,
            theme: "xq-light",
        });

        editorInstance.on("change", (api) => {
            onChange(api.getValue());
        });

        return function cleanup() {
            editorInstance.toTextArea();
        };
    }, [onChange, mode]);

    return (
        <div className={`${eccgui}-codeeditor`}>
            <textarea
                ref={domRef}
                /**
                 * FIXME: same `data-test-id` for multiple code editor elements are valid
                 * but may not make really sense for testing purposes. Currently let it
                 * unchanged from the code what was took over here.
                 */
                data-test-id="codemirror-wrapper"
                id={!!id ? id : `codemirror-${name}`}
                name={name}
                defaultValue={defaultValue}
            />
        </div>
    );
}
