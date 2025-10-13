import React, { useMemo, useRef } from "react";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { defaultHighlightStyle, foldKeymap } from "@codemirror/language";
import { EditorState, Extension, Compartment } from "@codemirror/state";
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
    adaptedLintGutter,
    adaptedPlaceholder,
    compartment,
    adaptedSyntaxHighlighting,
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
    onChange?: (v: string) => void;
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
    onCursorChange?: (pos: number, coords: Rect, scrollinfo: HTMLElement, cm: EditorView) => void;

    /**
     * Syntax mode of the code editor.
     */
    mode?: SupportedCodeEditorModes;
    /**
     * Default value used first when the editor is instanciated.
     */
    defaultValue?: string;
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

    outerDivAttributes?: Omit<React.HTMLAttributes<HTMLDivElement>, "id">;

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
     * Add toolbar for mode.
     * Currently only `markdown` is supported.
     */
    useToolbar?: boolean;
    /**
     * Get the translation for a specific key
     */
    translate?: (key: string) => string | false;
}

const addExtensionsFor = (flag: boolean, ...extensions: Extension[]) => (flag ? [...extensions] : []);
const addToKeyMapConfigFor = (flag: boolean, ...keys: KeyBinding[]) => (flag ? [...keys] : []);
const addHandlersFor = (flag: boolean, handlerName: string, handler: any) =>
    flag ? ({ [handlerName]: handler } as DOMEventHandlers<any>) : {};

const ModeLinterMap: ReadonlyMap<SupportedCodeEditorModes, ReadonlyArray<ExtensionCreator>> = new Map([
    ["turtle", [turtleLinter]],
    ["javascript", [jsLinter]],
]);

const ModeToolbarSupport: ReadonlyArray<SupportedCodeEditorModes> = ["markdown"];

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
    autoFocus = false,
    disabled = false,
    intent,
    useToolbar,
    translate,
    ...otherCodeEditorProps
}: CodeEditorProps) => {
    const parent = useRef<any>(undefined);
    const [view, setView] = React.useState<EditorView | undefined>();
    const currentView = React.useRef<EditorView>()
    currentView.current = view
    const currentReadOnly = React.useRef(readOnly)
    currentReadOnly.current = readOnly
    const [showPreview, setShowPreview] = React.useState<boolean>(false);
    // CodeMirror Compartments in order to allow for re-configuration after initialization
    const readOnlyCompartment = React.useRef<Compartment>(compartment())
    const wrapLinesCompartment = React.useRef<Compartment>(compartment())
    const preventLineNumbersCompartment = React.useRef<Compartment>(compartment())
    const shouldHaveMinimalSetupCompartment = React.useRef<Compartment>(compartment())
    const placeholderCompartment = React.useRef<Compartment>(compartment())
    const modeCompartment = React.useRef<Compartment>(compartment())
    const keyMapConfigsCompartment = React.useRef<Compartment>(compartment())
    const tabIntentSizeCompartment = React.useRef<Compartment>(compartment())
    const disabledCompartment = React.useRef<Compartment>(compartment())
    const supportCodeFoldingCompartment = React.useRef<Compartment>(compartment())
    const useLintingCompartment = React.useRef<Compartment>(compartment())
    const shouldHighlightActiveLineCompartment = React.useRef<Compartment>(compartment())

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
            if (event.key === "Enter" && !currentReadOnly.current) {
                const cursor = view.state.selection.main.head;
                view.dispatch({
                    changes: {
                        from: cursor,
                        insert: "\n",
                    },
                    selection: {
                        anchor: cursor + 1,
                    },
                });
            }
        }
    };

    const getTranslation = (key: string): string | false => {
        if (translate && typeof translate === "function") {
            return translate(key);
        }

        return false;
    };

    const createKeyMapConfigs = () => {
        const tabIndent =
            !!(tabIntentStyle === "tab" && mode && !(tabForceSpaceForModes ?? []).includes(mode)) || enableTab;
        return [
            defaultKeymap as KeyBinding,
            ...addToKeyMapConfigFor(supportCodeFolding, ...foldKeymap),
            ...addToKeyMapConfigFor(tabIndent, indentWithTab),
        ];
    }

    React.useEffect(() => {
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
            placeholderCompartment.current.of(adaptedPlaceholder(placeholder)),
            adaptedHighlightSpecialChars(),
            modeCompartment.current.of(useCodeMirrorModeExtension(mode)),
            keyMapConfigsCompartment.current.of(keymap?.of(createKeyMapConfigs())),
            tabIntentSizeCompartment.current.of(EditorState?.tabSize.of(tabIntentSize)),
            readOnlyCompartment.current.of(EditorState?.readOnly.of(readOnly)),
            disabledCompartment.current.of(EditorView?.editable.of(!disabled)),
            AdaptedEditorViewDomEventHandlers(domEventHandlers) as Extension,
            EditorView?.updateListener.of((v: ViewUpdate) => {
                if (disabled) return;

                if (onChange && v.docChanged) {
                    // Only fire if the text has actually been changed
                    onChange(v.state.doc.toString());
                }

                if (onSelection)
                    onSelection(v.state.selection.ranges.filter((r) => !r.empty).map(({ from, to }) => ({ from, to })));

                if (onFocusChange && intent && !v.view.dom.classList?.contains(`${eccgui}-intent--${intent}`)) {
                    v.view.dom.classList.add(`${eccgui}-intent--${intent}`);
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
            shouldHaveMinimalSetupCompartment.current.of(addExtensionsFor(shouldHaveMinimalSetup, minimalSetup)),
            preventLineNumbersCompartment.current.of(addExtensionsFor(!preventLineNumbers, adaptedLineNumbers())),
            shouldHighlightActiveLineCompartment.current.of(addExtensionsFor(shouldHighlightActiveLine, adaptedHighlightActiveLine())),
            wrapLinesCompartment.current.of(addExtensionsFor(wrapLines, EditorView?.lineWrapping)),
            supportCodeFoldingCompartment.current.of(addExtensionsFor(supportCodeFolding, adaptedFoldGutter(), adaptedCodeFolding())),
            useLintingCompartment.current.of(addExtensionsFor(useLinting, ...linters)),
            adaptedSyntaxHighlighting(defaultHighlightStyle),
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
    }, [parent.current]);

    // Updates an extension for a specific parameter that has changed after the initialization
    const updateExtension = (extension: Extension | undefined, parameterCompartment: Compartment): void => {
        if(extension) {
            currentView.current?.dispatch({
                effects: parameterCompartment.reconfigure(extension)
            })
        }
    }

    React.useEffect(() => {
        updateExtension(EditorState?.readOnly.of(readOnly!), readOnlyCompartment.current)
    }, [readOnly])

    React.useEffect(() => {
        updateExtension(adaptedPlaceholder(placeholder), placeholderCompartment.current)
    }, [placeholder])

    React.useEffect(() => {
        updateExtension(useCodeMirrorModeExtension(mode), modeCompartment.current)
    }, [mode])

    React.useEffect(() => {
        updateExtension(keymap?.of(createKeyMapConfigs()), keyMapConfigsCompartment.current)
    }, [supportCodeFolding, mode, tabIntentStyle, (tabForceSpaceForModes ?? []).join(", "), enableTab])

    React.useEffect(() => {
        updateExtension(EditorState?.tabSize.of(tabIntentSize ?? 2), tabIntentSizeCompartment.current)
    }, [tabIntentSize])

    React.useEffect(() => {
        updateExtension(EditorView?.editable.of(!disabled), disabledCompartment.current)
    }, [disabled])

    React.useEffect(() => {
        updateExtension(addExtensionsFor(shouldHaveMinimalSetup ?? true, minimalSetup), shouldHaveMinimalSetupCompartment.current)
    }, [shouldHaveMinimalSetup])

    React.useEffect(() => {
        updateExtension(addExtensionsFor(!preventLineNumbers, adaptedLineNumbers()), preventLineNumbersCompartment.current)
    }, [preventLineNumbers])

    React.useEffect(() => {
        updateExtension(addExtensionsFor(shouldHighlightActiveLine ?? false, adaptedHighlightActiveLine()), shouldHighlightActiveLineCompartment.current)
    }, [shouldHighlightActiveLine])

    React.useEffect(() => {
        updateExtension(addExtensionsFor(wrapLines ?? false, EditorView?.lineWrapping), wrapLinesCompartment.current)
    }, [wrapLines])

    React.useEffect(() => {
        updateExtension(addExtensionsFor(supportCodeFolding ?? false, adaptedFoldGutter(), adaptedCodeFolding()), supportCodeFoldingCompartment.current)
    }, [supportCodeFolding])

    React.useEffect(() => {
        updateExtension(addExtensionsFor(useLinting ?? false, ...linters), useLintingCompartment.current)
    }, [mode, useLinting])

    const hasToolbarSupport = mode && ModeToolbarSupport.indexOf(mode) > -1 && useToolbar;

    const editorToolbar = (mode?: SupportedCodeEditorModes): JSX.Element => {
        switch (mode) {
            case "markdown":
                return (
                    <div>
                        <div className={`${eccgui}-codeeditor__toolbar`}>
                            <MarkdownToolbar
                                view={view}
                                togglePreviewStatus={() => setShowPreview((p) => !p)}
                                showPreview={showPreview}
                                translate={getTranslation}
                                disabled={disabled}
                                readonly={readOnly}
                            />
                        </div>
                        {showPreview && (
                            <div className={`${eccgui}-codeeditor__preview`}>
                                <Markdown>{view?.state.doc.toString() ?? ""}</Markdown>
                            </div>
                        )}
                    </div>
                );
            default:
                return <></>;
        }
    };

    return (
        <div
            {...outerDivAttributes}
            // overwrite/extend some attributes
            id={id ? id : name ? `codemirror-${name}` : undefined}
            ref={parent}
            className={
                `${eccgui}-codeeditor ${eccgui}-codeeditor--mode-${mode}` +
                (outerDivAttributes?.className ? ` ${outerDivAttributes?.className}` : "") +
                (hasToolbarSupport ? ` ${eccgui}-codeeditor--has-toolbar` : "")
            }
            {...otherCodeEditorProps}
        >
            {hasToolbarSupport && editorToolbar(mode)}
        </div>
    );
};

CodeEditor.supportedModes = supportedCodeEditorModes;
