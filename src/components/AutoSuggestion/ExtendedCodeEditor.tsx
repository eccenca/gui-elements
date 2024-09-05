import React from "react";
import { Classes as BlueprintClassNames } from "@blueprintjs/core";
import { indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { quietlight } from "@uiw/codemirror-theme-quietlight";
import CodeMirror, { Extension, Rect, Statistics } from "@uiw/react-codemirror";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
//hooks
import {
    SupportedCodeEditorModes,
    useCodeMirrorModeExtension,
} from "../../extensions/codemirror/hooks/useCodemirrorModeExtension.hooks";

import { markField } from "./extensions/markText";

export interface IRange {
    from: number;
    to: number;
}

export interface ExtendedCodeEditorProps {
    // Is called with the editor instance that allows access via the CodeMirror API
    setCM: (editor: EditorView) => any;
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
    /** Placeholder tobe shown when no text has been entered, yet. */
    placeholder?: string;
    //show scrollbar
    showScrollBar?: boolean;
    /** allow multiline entries when new line characters are entered */
    multiline?: boolean;
    /**
     * additional extensions to customize the editor further
     */
    additionalExtensions?: Extension[];
}

export type IEditorProps = ExtendedCodeEditorProps;

/** A single-line code editor. */
export const ExtendedCodeEditor = ({
    multiline = false,
    mode,
    onChange,
    initialValue = "",
    onKeyDown,
    onMouseDown,
    placeholder,
    setCM,
    enableTab = false,
    onFocusChange,
    additionalExtensions = [],
    onCursorChange,
    onSelection,
}: ExtendedCodeEditorProps) => {
    const initialContent = React.useRef(multiline ? initialValue : initialValue.replace(/[\r\n]/g, " "));
    const [cm, setInternalCM] = React.useState<EditorView>();
    const multilineExtensions = multiline
        ? [lineNumbers(), EditorView.lineWrapping]
        : [
              EditorState.transactionFilter.of((tr) => (tr.newDoc.lines > 1 ? [] : tr)), //prevent multiline,
          ];
    const tabIndentEnabledExtension = (enableTab ? [indentWithTab] : []) as Extension[];

    const onKeyDownHandler = React.useCallback((event: KeyboardEvent, view: EditorView) => {
        if (!onKeyDown(event)) {
            if (event.key === "Enter") {
                const cursor = view.state.selection.main.head;
                const cursorLine = view.state.doc.lineAt(cursor).number;
                const offsetFromFirstLine = view.state.doc.line(cursorLine).to;
                view.dispatch({
                    changes: {
                        from: offsetFromFirstLine,
                        insert: "\n",
                    },
                    selection: {
                        anchor: offsetFromFirstLine + 1,
                    },
                });
            }
        }
    }, []);

    return (
        <div className={`${eccgui}-${multiline ? "codeeditor" : `singlelinecodeeditor ${BlueprintClassNames.INPUT}`}`}>
            <CodeMirror
                placeholder={placeholder}
                onCreateEditor={(view: EditorView) => {
                    setInternalCM(view);
                    setCM(view);
                }}
                basicSetup={false}
                value={initialContent.current}
                extensions={[
                    quietlight,
                    EditorView.domEventHandlers({
                        keydown: onKeyDownHandler,
                    }),
                    useCodeMirrorModeExtension(mode),
                    ...multilineExtensions,
                    ...tabIndentEnabledExtension,
                    markField,
                    ...additionalExtensions,
                ]}
                onChange={(value) => onChange(value)}
                onMouseDown={() => onMouseDown && cm && onMouseDown(cm)}
                onBlur={() => onFocusChange(false)}
                onFocus={() => onFocusChange(true)}
                onStatistics={(data: Statistics) => {
                    onSelection(data.ranges.filter((r) => !r.empty).map(({ from, to }) => ({ from, to })));
                    const cursorPosition = cm?.state.selection.main.head ?? 1;
                    const editorRect = cm?.dom.getBoundingClientRect();
                    const coords = cm?.coordsAtPos(cursorPosition),
                        scrollInfo = cm?.scrollDOM;
                    if (coords && scrollInfo && editorRect) {
                        // Calculate the coordinates relative to the editor's top-left corner
                        const relativeLeft = coords.left - editorRect.left;
                        const relativeBottom = coords.bottom - editorRect.bottom;

                        onCursorChange(
                            cursorPosition,
                            { ...coords, left: relativeLeft, bottom: relativeBottom },
                            scrollInfo,
                            cm
                        );
                    }
                }}
            />
        </div>
    );
};

export default ExtendedCodeEditor;
