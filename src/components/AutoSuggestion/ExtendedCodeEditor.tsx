import "codemirror/addon/display/placeholder.js";
import "codemirror/mode/sparql/sparql.js";
import React from "react";
import { UnControlled as UnControlledEditor } from "react-codemirror2";
import { Classes as BlueprintClassNames } from "@blueprintjs/core";
import { Editor as CodeMirrorEditor, EditorChange } from "codemirror";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface IRange {
    from: number;
    to: number;
}

export interface ExtendedCodeEditorProps {
    // Is called with the editor instance that allows access via the CodeMirror API
    setEditorInstance: (editor: CodeMirrorEditor) => any;
    // Called whenever the editor content changes
    onChange: (value: string) => any;
    // Called when the cursor position changes
    onCursorChange: (pos: any, coords: any, scrollinfo: any) => any;
    // The editor theme, e.g. "sparql"
    mode?: string;
    // The initial value of the editor
    initialValue: string;
    // Called when the focus status changes
    onFocusChange: (focused: boolean) => any;
    // Called when the user presses a key
    onKeyDown: (event: KeyboardEvent) => any;
    // function invoked when any click occurs
    onMouseDown: (editor: CodeMirrorEditor) => any;
    // Called when the user selects text
    onSelection: (ranges: IRange[]) => any;
    // If the <Tab> key is enabled as normal input, i.e. it won't have the behavior of changing to the next input element, expected in a web app.
    enableTab?: boolean;
    /** Placeholder tobe shown when no text has been entered, yet. */
    placeholder?: string;
    //show scrollbar
    showScrollBar?: boolean;
    /** allow multiline entries when new line characters are entered */
    multiline?: boolean;
}

export type IEditorProps = ExtendedCodeEditorProps;

/** A single-line code editor. */
export const ExtendedCodeEditor = ({
    setEditorInstance,
    onChange,
    onCursorChange,
    mode,
    initialValue = "",
    onFocusChange,
    onKeyDown,
    onSelection,
    enableTab = false,
    placeholder,
    showScrollBar = true,
    multiline = false,
    onMouseDown,
}: ExtendedCodeEditorProps) => {
    const initialContent = React.useRef(multiline ? initialValue : initialValue.replace(/[\r\n]/g, " "));

    const extendedEditorProps = {
        editorDidMount: (editor: any) => {
            editor.on("beforeChange", (_: any, change: any) => {
                // Prevent the user from entering new-line characters, since this is supposed to be a one-line editor.
                if (change.update && typeof change.update === "function" && change.text.length > 1) {
                    change.update(change.from, change.to, [change.text.join("")]);
                }
                return true;
            });
            setEditorInstance(editor);
        },
        onBeforeChange: (_editor: CodeMirrorEditor, data: EditorChange, _: string, next: () => any) => {
            // Reduce multiple lines to a single line
            if (data.text.length > 1) {
                _editor.setValue(data.text.join(""));
            }
            next();
        },
    };

    const extraEditorProps = multiline
        ? {
              editorDidMount: (editor: any) => {
                  setEditorInstance(editor);
              },
          }
        : extendedEditorProps;

    return (
        <div className={`${eccgui}-${multiline ? "codeeditor" : `singlelinecodeeditor ${BlueprintClassNames.INPUT}`}`}>
            <UnControlledEditor
                value={initialContent.current}
                onFocus={() => onFocusChange(true)}
                onBlur={() => onFocusChange(false)}
                options={{
                    mode: mode,
                    lineNumbers: multiline,
                    lineWrapping: multiline,
                    theme: "xq-light",
                    extraKeys: enableTab ? undefined : { Tab: false },
                    placeholder,
                    scrollbarStyle: showScrollBar ? "native" : "null",
                }}
                onSelection={(_editor, data) => {
                    if (Array.isArray(data?.ranges)) {
                        onSelection(
                            data.ranges
                                .map((r: any) => ({ from: r.from().ch, to: r.to().ch }))
                                .filter((r: any) => r.from !== r.to)
                        );
                    }
                }}
                onCursor={(editor, data) => {
                    onCursorChange(data, editor.cursorCoords(true, "local"), editor.getScrollInfo());
                }}
                onChange={(_editor, _data, value) => {
                    onChange(value);
                }}
                onMouseDown={(editor) => onMouseDown(editor)}
                onKeyDown={(_, event) => onKeyDown(event)}
                {...extraEditorProps}
            />
        </div>
    );
};

export default ExtendedCodeEditor;
