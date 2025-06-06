import React from "react";
import { Classes as BlueprintClassNames } from "@blueprintjs/core";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers, Rect } from "@codemirror/view";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { CodeEditor, CodeEditorProps } from "../../extensions/codemirror/CodeMirror";
//hooks
import { SupportedCodeEditorModes } from "../../extensions/codemirror/hooks/useCodemirrorModeExtension.hooks";

export interface IRange {
    from: number;
    to: number;
}

export interface ExtendedCodeEditorProps {
    // Is called with the editor instance that allows access via the CodeMirror API
    setCM: (editor: EditorView | undefined) => void;
    // Called whenever the editor content changes
    onChange: (value: string) => void;
    // Called when the cursor position changes
    onCursorChange: (pos: number, coords: Rect, scrollinfo: HTMLElement, cm: EditorView) => void;
    // The editor theme, e.g. "sparql"
    mode?: SupportedCodeEditorModes;
    // The initial value of the editor
    initialValue: string;
    // Called when the focus status changes
    onFocusChange: (focused: boolean) => void;
    // Called when the user presses a key
    onKeyDown: (event: KeyboardEvent) => boolean;
    // function invoked when any click occurs
    onMouseDown?: (view: EditorView) => void;
    // Called when the user selects text
    onSelection: (ranges: IRange[]) => void;
    // If the <Tab> key is enabled as normal input, i.e. it won't have the behavior of changing to the next input element, expected in a web app.
    enableTab?: boolean;
    /** Placeholder to be shown when no text has been entered, yet. */
    placeholder?: string;
    //show scrollbar
    showScrollBar?: boolean;
    /** allow multiline entries when new line characters are entered */
    multiline?: boolean;
    /**
     * Code editor props
     */
    codeEditorProps?: Omit<
        CodeEditorProps,
        | "defaultValue"
        | "setEditorView"
        | "onChange"
        | "onCursorChange"
        | "onFocusChange"
        | "onKeyDown"
        | "onSelection"
        | "onMouseDown"
        | "shouldHaveMinimalSetup"
        | "preventLineNumbers"
        | "mode"
        | "name"
        | "enableTab"
        | "additionalExtensions"
        | "outerDivAttributes"
    >;
    /** Optional height of the component */
    height?: number | string;
    /** Set read-only mode. Default: false */
    readOnly?: boolean;
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
    codeEditorProps,
    height, 
    readOnly
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
            height={height}
            readOnly={readOnly}
            name=""
            enableTab={enableTab}
            additionalExtensions={[...multilineExtensions]}
            outerDivAttributes={{
                className: `${eccgui}-${
                    multiline ? "codeeditor" : `singlelinecodeeditor ${BlueprintClassNames.INPUT}`
                }`,
            }}
            {...codeEditorProps}
        />
    );
};

export default ExtendedCodeEditor;
