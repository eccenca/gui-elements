import "codemirror/addon/display/placeholder.js"
import "codemirror/mode/sparql/sparql.js";
import React from "react";
import {UnControlled as UnControlledEditor} from "react-codemirror2";
import {Classes as BlueprintClassNames} from "@blueprintjs/core";
import {Editor as CodeMirrorEditor} from "codemirror";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";

export interface IRange {
  from: number
  to: number
}

export interface SingleLineCodeEditorProps {
    // Is called with the editor instance that allows access via the CodeMirror API
    setEditorInstance: (editor: CodeMirrorEditor) => any
    // Called whenever the editor content changes
    onChange: (value: string) => any
    // Called when the cursor position changes
    onCursorChange: (pos: any, coords: any, scrollinfo: any) => any
    // The editor theme, e.g. "sparql"
    mode?: string
    // The initial value of the editor
    initialValue: string
    // Called when the focus status changes
    onFocusChange: (focused: boolean) => any
    // Called when the user presses a key
    onKeyDown: (event: KeyboardEvent) => any
    // Called when the user selects text
    onSelection: (ranges: IRange[]) => any
    // If the <Tab> key is enabled as normal input, i.e. it won't have the behavior of changing to the next input element, expected in a web app.
    enableTab?: boolean
    /** Placeholder tobe shown when no text has been entered, yet. */
    placeholder?: string
    showScrollBar?: boolean
    multiline?:boolean
}

export type IEditorProps = SingleLineCodeEditorProps;

/** A single-line code editor. */
export const SingleLineCodeEditor = ({
    setEditorInstance,
    onChange,
    onCursorChange,
    mode,
    initialValue,
    onFocusChange,
    onKeyDown,
    onSelection,
    enableTab = false,
    placeholder,
    showScrollBar = true, 
    multiline = false
}: SingleLineCodeEditorProps) => {
    const singleLineInitialContent = React.useRef(initialValue.replace(/[\r\n]/g, " "))
    return (
      <div className={`${eccgui}-${multiline ? "codeeditor" : `singlelinecodeeditor ${BlueprintClassNames.INPUT}`}`}>
            <UnControlledEditor
        editorDidMount={(editor: any) => {
          editor.on("beforeChange", (_: any, change: any) => {
            // Prevent the user from entering new-line characters, since this is supposed to be a one-line editor.
            if (change.update && typeof change.update === "function" && change.text.length > 1) {
              change.update(change.from, change.to, [change.text.join("")]);
            }
            return true;
          });
          setEditorInstance(editor);
        }}
        value={singleLineInitialContent.current}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        options={{
            mode: mode,
            lineNumbers: multiline,
            lineWrapping: multiline,
            theme: "xq-light",
            extraKeys: enableTab ? undefined : {Tab: false},
            placeholder,
            scrollbarStyle: showScrollBar ? "native" : "null"
        }}
        onSelection={(_editor, data) => {
          if(Array.isArray(data?.ranges)) {
            onSelection(data.ranges
                .map((r: any) => ({from: r.from().ch, to: r.to().ch}))
                .filter((r: any) => r.from !== r.to))
          }
        }}
        onCursor={(editor, data) => {
          onCursorChange(
              data,
              editor.cursorCoords(true, "local"),
              editor.getScrollInfo()
          );
        }}
        onBeforeChange={(_editor, data, _, next) => {
            // Reduce multiple lines to a single line
            if (data.text.length > 1) {
                _editor.setValue(data.text.join(""))
            }
            next()
        }}
        onChange={(_editor, _data, value) => {
            onChange(value);
        }
        }
        onKeyDown={(_, event) => onKeyDown(event)}
      />
    </div>
  );
};

export default SingleLineCodeEditor;
