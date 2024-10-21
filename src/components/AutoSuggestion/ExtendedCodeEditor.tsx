import React from "react";
import { Classes as BlueprintClassNames } from "@blueprintjs/core";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers, Rect } from "@codemirror/view";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { CodeEditor } from "../../extensions/codemirror/CodeMirror";
//hooks
import { SupportedCodeEditorModes } from "../../extensions/codemirror/hooks/useCodemirrorModeExtension.hooks";

import { markField } from "./extensions/markText";

export interface IRange {
    from: number;
    to: number;
}

export interface ExtendedCodeEditorProps {
    // Is called with the editor instance that allows access via the CodeMirror API
    setCM: (editor: EditorView | undefined) => any;
    // Called whenever the editor content changes
    onChange: (value: string) => any;
    // Called when the cursor position changes
    onCursorChange: (pos: number, coords: Rect, scrollinfo: HTMLElement, cm: EditorView) => any;
    // The editor theme, e.g. "sparql"
    mode?: SupportedCodeEditorModes;
    // The initial value of the editor
    initialValue: string;
    // Called when the focus status changes
    onFocusChange: (focused: boolean) => any;
    // Called when the user presses a key
    onKeyDown: (event: KeyboardEvent) => boolean;
    // function invoked when any click occurs
    onMouseDown?: (view: EditorView) => void;
    // Called when the user selects text
    onSelection: (ranges: IRange[]) => any;
    // If the <Tab> key is enabled as normal input, i.e. it won't have the behavior of changing to the next input element, expected in a web app.
    enableTab?: boolean;
    /** Placeholder to be shown when no text has been entered, yet. */
    placeholder?: string;
    //show scrollbar
    showScrollBar?: boolean;
    /** allow multiline entries when new line characters are entered */
    multiline?: boolean;
}

export type IEditorProps = ExtendedCodeEditorProps;

/** Supports single-line and multiline editing. */
export const ExtendedCodeEditor = ({
    multiline = false,
    initialValue = "",
    onKeyDown,
    enableTab = false,
    mode,
    setCM,
    onFocusChange,
    onMouseDown,
    onChange,
    placeholder,
    onCursorChange,
    onSelection,
}: ExtendedCodeEditorProps) => {
    const initialContent = React.useRef(multiline ? initialValue : initialValue.replace(/[\r\n]/g, " "));
    const multilineExtensions = multiline
        ? [lineNumbers(), EditorView.lineWrapping]
        : [
              EditorState?.transactionFilter.of((tr) => (tr.newDoc.lines > 1 ? [] : tr)), //prevent multiline,
          ];

    return (
        <CodeEditor
            defaultValue={initialContent.current}
            setEditorView={setCM}
            onSelection={onSelection}
            onMouseDown={onMouseDown}
            onChange={onChange}
            placeholder={placeholder}
            onCursorChange={onCursorChange}
            onFocusChange={onFocusChange}
            onKeyDown={onKeyDown}
            shouldHaveMinimalSetup={false}
            preventLineNumbers={!multiline}
            mode={mode}
            name=""
            enableTab={enableTab}
            additionalExtensions={[markField, ...multilineExtensions]}
            outerDivAttributes={{
                className: `${eccgui}-${
                    multiline ? "codeeditor" : `singlelinecodeeditor ${BlueprintClassNames.INPUT}`
                }`,
            }}
        />
    );
};

export default ExtendedCodeEditor;
