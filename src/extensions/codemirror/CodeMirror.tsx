import React, { AllHTMLAttributes, useRef } from "react";

//code
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { foldGutter, codeFolding, foldKeymap } from "@codemirror/language";
import {
    EditorView,
    keymap,
    lineNumbers,
    highlightSpecialChars,
    highlightActiveLine,
    DOMEventHandlers,
} from "@codemirror/view";

//hooks
import { SupportedCodeEditorModes, useCodeMirrorModeExtension } from "./hooks/useCodemirrorModeExtension.hooks";

//theme
import { githubLight } from "@uiw/codemirror-theme-github";

//constants
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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

    outerDivAttributes?: Partial<AllHTMLAttributes<HTMLDivElement>>;

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
    /**
     * highlight active line
     */
    shouldHighlightActiveLine?: boolean;
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
    height = 290,
    wrapLines = false,
    onScroll,
    setEditorView,
    supportCodeFolding = false,
    shouldHighlightActiveLine = false,
    outerDivAttributes,
    tabIntentSize = 2,
    tabIntentStyle = "tab",
    tabForceSpaceForModes = ["python", "yaml"],
}: CodeEditorProps) => {
    const parent = useRef<any>(undefined);

    React.useEffect(() => {
        const keyMapConfigs = [defaultKeymap as any];
        const domEventHandlers = {} as DOMEventHandlers<any>;
        let extensions = [
            githubLight,
            highlightSpecialChars(),
            useCodeMirrorModeExtension(mode),
            keymap.of(keyMapConfigs),
            EditorState.tabSize.of(tabIntentSize),
            EditorState.readOnly.of(readOnly),
            EditorView.domEventHandlers(domEventHandlers),
        ];

        if (!preventLineNumbers) {
            extensions.push(lineNumbers());
        }

        if (shouldHighlightActiveLine) {
            extensions.push(highlightActiveLine());
        }

        if (wrapLines) {
            extensions.push(EditorView.lineWrapping);
        }

        if (supportCodeFolding) {
            extensions = [...extensions, foldGutter(), codeFolding()];
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
            {...(!outerDivAttributes?.height ? { style: { height } } : {})}
            {...outerDivAttributes}
            id={id}
            ref={parent}
            className={`${eccgui}-codeeditor ${eccgui}-codeeditor--mode-${mode}`}
        />
    );
};
