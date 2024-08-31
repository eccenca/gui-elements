import React, { KeyboardEventHandler } from "react";
// import { UnControlled as UnControlledEditor, DomEvent } from "react-codemirror2";
import CodeMirror, { Extension, Statistics, Rect } from "@uiw/react-codemirror";
import { EditorView, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { githubLight } from "@uiw/codemirror-theme-github";

import { Classes as BlueprintClassNames } from "@blueprintjs/core";
import { markField } from "./extensions/markText";

// import "codemirror/addon/display/placeholder.js";

//hooks
import {
    SupportedCodeEditorModes,
    useCodeMirrorModeExtension,
} from "../../extensions/codemirror/hooks/useCodemirrorModeExtension.hooks";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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
    onCursorChange: (pos: number, coords: Rect, scrollinfo: HTMLElement) => any;
    // The editor theme, e.g. "sparql"
    mode?: SupportedCodeEditorModes;
    // The initial value of the editor
    initialValue: string;
    // Called when the focus status changes
    onFocusChange: (focused: boolean) => any;
    // Called when the user presses a key
    onKeyDown: KeyboardEventHandler<HTMLDivElement>;
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
    const tabIndentEnabledExtension = enableTab ? [indentWithTab] : [];

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
                    githubLight,
                    useCodeMirrorModeExtension(mode),
                    ...multilineExtensions,
                    ...tabIndentEnabledExtension,
                    markField,
                    ...additionalExtensions,
                ]}
                onChange={(value) => onChange(value)}
                onKeyDown={onKeyDown}
                onMouseDown={() => onMouseDown && cm && onMouseDown(cm)}
                onBlur={() => onFocusChange(false)}
                onFocus={() => onFocusChange(true)}
                onStatistics={(data: Statistics) => {
                    onSelection(data.ranges.filter((r) => !r.empty).map(({ from, to }) => ({ from, to })));
                    const cursorPosition = data.selection.main.head;
                    const coords = cm?.coordsAtPos(cursorPosition),
                        scrollInfo = cm?.scrollDOM;
                    coords && scrollInfo && onCursorChange(cursorPosition, coords, scrollInfo);
                }}
            />
        </div>
    );

    // const extendedEditorProps = {
    //     editorDidMount: (editor: any) => {
    //         editor.on("beforeChange", (_: any, change: any) => {
    //             // Prevent the user from entering new-line characters, since this is supposed to be a one-line editor.
    //             if (change.update && typeof change.update === "function" && change.text.length > 1) {
    //                 change.update(change.from, change.to, [change.text.join("")]);
    //             }
    //             return true;
    //         });
    //         setEditorInstance(editor);
    //     },
    //     onBeforeChange: (_editor: any, data: any, _: string, next: () => any) => {
    //         // Reduce multiple lines to a single line
    //         if (data.text.length > 1) {
    //             _editor.setValue(data.text.join(""));
    //         }
    //         next();
    //     },
    // };

    // return (
    //     <div className={`${eccgui}-${multiline ? "codeeditor" : `singlelinecodeeditor ${BlueprintClassNames.INPUT}`}`}>
    //         <UnControlledEditor
    //             value={initialContent.current}
    //             onFocus={() => onFocusChange(true)}
    //             onBlur={() => onFocusChange(false)}
    //             options={{
    //                 mode: mode,
    //                 lineNumbers: multiline,
    //                 lineWrapping: multiline,
    //                 theme: "xq-light",
    //                 extraKeys: enableTab ? undefined : { Tab: false },
    //                 placeholder,
    //                 scrollbarStyle: showScrollBar ? "native" : "null",
    //             }}
    //             onSelection={(_editor, data) => {
    //                 if (Array.isArray(data?.ranges)) {
    //                     onSelection(
    //                         data.ranges
    //                             .map((r: any) => ({ from: r.from().ch, to: r.to().ch }))
    //                             .filter((r: any) => r.from !== r.to)
    //                     );
    //                 }
    //             }}
    //             onCursor={(editor, data) => {
    //                 onCursorChange(data, editor.cursorCoords(true, "local"), editor.getScrollInfo());
    //             }}
    //             onChange={(_editor, _data, value) => {
    //                 onChange(value);
    //             }}
    //             onMouseDown={(editor) => onMouseDown && onMouseDown(editor)}
    //             onKeyDown={(_, event) => onKeyDown(event)}
    //         />
    //     </div>
    // );
};

export default ExtendedCodeEditor;
