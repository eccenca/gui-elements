import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/sparql/sparql.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/turtle/turtle.js";
import "codemirror/mode/xml/xml.js";

export interface CodeEditorProps {
    name: string;
    id?: string;
    onChange: (v: any) => void;
    mode?: "markdown" | "python" | "sparql" | "sql" | "turtle" | "xml" | "undefined";
    defaultValue?: any;
}

/**
 * Includes a code editor, currently we use CodeMirror library as base.
 */
const CodeEditor = ({
    onChange,
    name,
    id,
    mode = "undefined",
    defaultValue
}: CodeEditorProps) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (onChange !== undefined && ref.current) {
            const editorInstance = CodeMirror.fromTextArea(ref.current, {
                mode: mode === "undefined" ? undefined : mode,
                lineWrapping: true,
                lineNumbers: true,
                tabSize: 2,
                theme: "xq-light",
            });

            editorInstance.on("change", (api) => {
                onChange(api.getValue());
            });
        }
    }, [onChange, mode]);

    return (
        <textarea
            /**
             * FIXME: same `data-test-id` for multiple code editor elements are valid
             * but may not make really sense for testing purposes. Currently let it
             * unchanged from the code what was took over here.
             */
            data-test-id="codemirror-wrapper"
            ref={ref}
            id={id??`codemirror-${name}`}
            name={name}
            defaultValue={defaultValue}
        />
    );
}

export default CodeEditor;
