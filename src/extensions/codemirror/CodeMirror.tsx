import React, { useMemo, useRef } from "react";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { foldKeymap } from "@codemirror/language";
import { EditorState, Extension } from "@codemirror/state";
import { DOMEventHandlers, EditorView, KeyBinding, keymap, Rect, ViewUpdate } from "@codemirror/view";
import { minimalSetup } from "codemirror";

import { IntentTypes } from "../../common/Intent";
import { markField } from "../../components/AutoSuggestion/extensions/markText";
import { TestableComponent } from "../../components/interfaces";
import { MarkdownToolbar } from "./toolbars/markdown.toolbar";
import { Markdown } from "../../cmem/markdown/Markdown";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

//hooks
import {
    SupportedCodeEditorModes,
    supportedCodeEditorModes,
    useCodeMirrorModeExtension,
} from "./hooks/useCodemirrorModeExtension.hooks";
import { jsLinter } from "./linters/jsLinter";
import { turtleLinter } from "./linters/turtleLinter";
//adaptations
import {
    adaptedCodeFolding,
    AdaptedEditorView,
    AdaptedEditorViewDomEventHandlers,
    adaptedFoldGutter,
    adaptedHighlightActiveLine,
    adaptedHighlightSpecialChars,
    adaptedLineNumbers,
    adaptedPlaceholder,
    adaptedLintGutter,
} from "./tests/codemirrorTestHelper";
import { ExtensionCreator } from "./types";

export interface CodeEditorProps extends TestableComponent {
    // Is called with the editor instance that allows access via the CodeMirror API
    setEditorView?: (editor: EditorView | undefined) => void;
    /**
     * `name` attribute of connected textarea element.
     */
    name: string;
    /**
     * Placeholder to be shown when no text has been entered, yet.
     */
    placeholder?: string;
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
     *  Called when the focus status changes
     */
    onFocusChange?: (focused: boolean) => void;
    /**
     * Called when the user presses a key
     */
    onKeyDown?: (event: KeyboardEvent) => boolean;
    /**
     * function invoked when any click occurs
     */
    onMouseDown?: (view: EditorView) => void;
    /**
     * Called when the user selects text
     */
    onSelection?: (ranges: { from: number; to: number }[]) => void;
    /**
     * Called when the cursor position changes
     */
    onCursorChange?: (pos: number, coords: Rect, scrollinfo: HTMLElement, cm: EditorView) => any;

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

    outerDivAttributes?: Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "data-test-id">;

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
    /**
     * additional extensions to customize the editor further
     */
    additionalExtensions?: Extension[];
    /**
     * codemirror minimal setup flag
     */
    shouldHaveMinimalSetup?: boolean;
    /**
     * If the <Tab> key is enabled as normal input, i.e. it won't have the behavior of changing to the next input element, expected in a web app.
     */
    enableTab?: boolean;
    /**
     * Enables linting feature in the editor ("turtle" and "javascript" modes can use linting currently).
     */
    useLinting?: boolean;

    /**
     * Autofocus the editor when it is rendered
     */
    autoFocus?: boolean;
    /**
     * Intent state of the code editor.
     */
    intent?: IntentTypes | "edited" | "removed";
    /**
     * Disables the editor.
     */
    disabled?: boolean;
    /**
     *  optional flag to add helper toolbar for markdown mode
     */
    hasToolbar?: boolean;
}

const addExtensionsFor = (flag: boolean, ...extensions: Extension[]) => (flag ? [...extensions] : []);
const addToKeyMapConfigFor = (flag: boolean, ...keys: any) => (flag ? [...keys] : []);
const addHandlersFor = (flag: boolean, handlerName: string, handler: any) =>
    flag ? ({ [handlerName]: handler } as DOMEventHandlers<any>) : {};

const ModeLinterMap: ReadonlyMap<SupportedCodeEditorModes, ReadonlyArray<ExtensionCreator>> = new Map([
    ["turtle", [turtleLinter]],
    ["javascript", [jsLinter]],
]);

/**
 * Includes a code editor, currently we use CodeMirror library as base.
 */
export const CodeEditor = ({
    onChange,
    onSelection,
    onMouseDown,
    onFocusChange,
    onKeyDown,
    onCursorChange,
    name,
    id,
    mode,
    preventLineNumbers = false,
    defaultValue = "",
    readOnly = false,
    shouldHaveMinimalSetup = true,
    wrapLines = false,
    onScroll,
    setEditorView,
    supportCodeFolding = false,
    shouldHighlightActiveLine = false,
    outerDivAttributes,
    tabIntentSize = 2,
    tabIntentStyle = "tab",
    placeholder,
    additionalExtensions = [],
    tabForceSpaceForModes = ["python", "yaml"],
    enableTab = false,
    height,
    useLinting = false,
    "data-test-id": dataTestId,
    autoFocus = false,
    disabled = false,
    intent,
    hasToolbar,
    ...otherCodeEditorProps
}: CodeEditorProps) => {
    const parent = useRef<any>(undefined);
    const [view, setView] = React.useState<EditorView | undefined>();
    const [showPreview, setShowPreview] = React.useState<boolean>(false);

    const linters = useMemo(() => {
        if (!mode) {
            return [];
        }

        const values = [adaptedLintGutter()];

        const linters = ModeLinterMap.get(mode);
        if (linters) {
            values.push(...linters.map((linter) => linter()));
        }

        return values;
    }, [mode]);

    const onKeyDownHandler = (event: KeyboardEvent, view: EditorView) => {
        if (onKeyDown && !onKeyDown(event)) {
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
    };

    const isMarkdownModeWithToolbar = mode === "markdown" && hasToolbar;

    React.useEffect(() => {
        const tabIndent =
            !!(tabIntentStyle === "tab" && mode && !(tabForceSpaceForModes ?? []).includes(mode)) || enableTab;
        const keyMapConfigs = [
            defaultKeymap as KeyBinding,
            ...addToKeyMapConfigFor(supportCodeFolding, foldKeymap),
            ...addToKeyMapConfigFor(tabIndent, indentWithTab),
        ];
        const domEventHandlers = {
            ...addHandlersFor(!!onScroll, "scroll", onScroll),
            ...addHandlersFor(
                !!onMouseDown,
                "mousedown",
                (_: any, view: EditorView) => onMouseDown && onMouseDown(view)
            ),
            ...addHandlersFor(!!onFocusChange, "blur", () => onFocusChange && onFocusChange(false)),
            ...addHandlersFor(!!onFocusChange, "focus", () => onFocusChange && onFocusChange(true)),
            ...addHandlersFor(!!onKeyDown, "keydown", onKeyDownHandler),
        } as DOMEventHandlers<any>;
        const extensions = [
            markField,
            adaptedPlaceholder(placeholder),
            adaptedHighlightSpecialChars(),
            useCodeMirrorModeExtension(mode),
            keymap?.of(keyMapConfigs),
            EditorState?.tabSize.of(tabIntentSize),
            EditorState?.readOnly.of(readOnly),
            EditorView?.editable.of(!disabled),
            AdaptedEditorViewDomEventHandlers(domEventHandlers) as Extension,
            EditorView?.updateListener.of((v: ViewUpdate) => {
                if (disabled) return;

                if (onChange) {
                    onChange(v.state.doc.toString());
                }

                if (onSelection)
                    onSelection(v.state.selection.ranges.filter((r) => !r.empty).map(({ from, to }) => ({ from, to })));

                if (onFocusChange) {
                    v.view.dom.className += ` ${eccgui}-intent--${intent}`;
                }

                if (onCursorChange) {
                    const cursorPosition = v.state.selection.main.head ?? 0;
                    const editorRect = v.view.dom.getBoundingClientRect();
                    const coords = v.view.coordsAtPos(cursorPosition),
                        scrollInfo = v.view.scrollDOM;
                    if (coords && scrollInfo && editorRect) {
                        // Calculate the coordinates relative to the editor's top-left corner
                        const relativeLeft = coords.left - editorRect.left;
                        const relativeBottom = coords.bottom - editorRect.bottom;

                        onCursorChange(
                            cursorPosition,
                            { ...coords, left: relativeLeft, bottom: relativeBottom },
                            scrollInfo,
                            v.view
                        );
                    }
                }
            }),
            addExtensionsFor(shouldHaveMinimalSetup, minimalSetup),
            addExtensionsFor(!preventLineNumbers, adaptedLineNumbers()),
            addExtensionsFor(shouldHighlightActiveLine, adaptedHighlightActiveLine()),
            addExtensionsFor(wrapLines, EditorView?.lineWrapping),
            addExtensionsFor(supportCodeFolding, adaptedFoldGutter(), adaptedCodeFolding()),
            addExtensionsFor(useLinting, ...linters),
            additionalExtensions,
        ];

        const view: EditorView = new AdaptedEditorView({
            state: EditorState?.create({
                doc: defaultValue,
                extensions,
            }),
            parent: parent.current,
        });
        setView(view);

        if (view?.dom) {
            if (height) {
                view.dom.style.height = typeof height === "string" ? height : `${height}px`;
            }

            if (disabled) {
                view.dom.className += ` ${eccgui}-disabled`;
            }

            if (intent) {
                view.dom.className += ` ${eccgui}-intent--${intent}`;
            }

            if (autoFocus) {
                view.focus();
            }

            if (setEditorView) {
                setEditorView(view);
            }
        }

        return () => {
            view.destroy();
            if (setEditorView) {
                setEditorView(undefined);
                setView(undefined);
            }
        };
    }, [parent.current, mode, preventLineNumbers]);

    return (
        <div
            {...outerDivAttributes}
            // overwrite/extend some attributes
            id={id ? id : name ? `codemirror-${name}` : undefined}
            ref={parent}
            // @deprecated (v25) fallback with static test id will be removed
            data-test-id={dataTestId ? dataTestId : "codemirror-wrapper"}
            className={
                `${eccgui}-codeeditor ${eccgui}-codeeditor--mode-${mode}` +
                (outerDivAttributes?.className ? ` ${outerDivAttributes?.className}` : "") +
                (isMarkdownModeWithToolbar ? ` ${eccgui}-codeeditor--accommodate-toolbar` : "")
            }
            {...otherCodeEditorProps}
        >
            {isMarkdownModeWithToolbar ? (
                <div>
                    <MarkdownToolbar
                        view={view}
                        togglePreviewStatus={() => setShowPreview((p) => !p)}
                        showPreview={showPreview}
                    />
                    {showPreview && (
                        <div className={`${eccgui}-codeeditor--markdown`}>
                            <Markdown>{view?.state.doc.toString() ?? ""}</Markdown>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

CodeEditor.supportedModes = supportedCodeEditorModes;
