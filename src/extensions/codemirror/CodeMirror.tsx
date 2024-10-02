import React, { AllHTMLAttributes, useRef } from "react";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { codeFolding, foldGutter, foldKeymap } from "@codemirror/language";
import { EditorState, Extension } from "@codemirror/state";
import {
    DOMEventHandlers,
    EditorView,
    highlightActiveLine,
    highlightSpecialChars,
    KeyBinding,
    keymap,
    lineNumbers,
    ViewUpdate,
} from "@codemirror/view";
//CodeMirror
import { minimalSetup } from "codemirror";

//constants
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

//hooks
import {
    SupportedCodeEditorModes,
    supportedCodeEditorModes,
    useCodeMirrorModeExtension,
} from "./hooks/useCodemirrorModeExtension.hooks";
//adaptations
import { AdaptedEditorViewDomEventHandlers } from "./tests/codemirrorTestHelper";
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
     * highlight active line where the cursor is currently in
     */
    shouldHighlightActiveLine?: boolean;
}

const addExtensionsFor = (flag: boolean, ...extensions: Extension[]) => (flag ? [...extensions] : []);
const addToKeyMapConfigFor = (flag: boolean, ...keys: any) => (flag ? [...keys] : []);
const addHandlersFor = (flag: boolean, handlerName: string, handler: any) =>
    flag ? ({ [handlerName]: handler } as DOMEventHandlers<any>) : {};

/**
 * Includes a code editor, currently we use CodeMirror library as base.
 */
export const CodeEditor = ({
    onChange,
    name,
    id,
    mode,
    preventLineNumbers = false,
    defaultValue = "",
    readOnly = false,
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
        const tabIndent = !!(tabIntentStyle === "tab" && mode && !(tabForceSpaceForModes ?? []).includes(mode));
        const keyMapConfigs = [
            defaultKeymap as KeyBinding,
            ...addToKeyMapConfigFor(supportCodeFolding, foldKeymap),
            ...addToKeyMapConfigFor(tabIndent, indentWithTab),
        ];
        const domEventHandlers = {
            ...addHandlersFor(!!onScroll, "scroll", onScroll),
        } as DOMEventHandlers<any>;
        const extensions = [
            minimalSetup,
            highlightSpecialChars(),
            useCodeMirrorModeExtension(mode),
            keymap.of(keyMapConfigs),
            EditorState?.tabSize.of(tabIntentSize),
            EditorState?.readOnly.of(readOnly),
            AdaptedEditorViewDomEventHandlers(domEventHandlers) as Extension,
            EditorView?.updateListener.of((v: ViewUpdate) => {
                if (v.docChanged) {
                    onChange && onChange(v.state.doc.toString());
                }
            }),
            addExtensionsFor(!preventLineNumbers, lineNumbers()),
            addExtensionsFor(shouldHighlightActiveLine, highlightActiveLine()),
            addExtensionsFor(wrapLines, EditorView.lineWrapping),
            addExtensionsFor(supportCodeFolding, foldGutter(), codeFolding()),
        ];

        const view = new EditorView({
            state: EditorState?.create({
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
            id={id ? id : `codemirror-${name}`}
            ref={parent}
            data-test-id="codemirror-wrapper"
            className={`${eccgui}-codeeditor ${eccgui}-codeeditor--mode-${mode}`}
            {...outerDivAttributes}
        />
    );
};

CodeEditor.supportedModes = supportedCodeEditorModes;
