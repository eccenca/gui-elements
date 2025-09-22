/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { Classes as BlueprintClassNames } from "@blueprintjs/core";
import { EditorView, Rect } from "@codemirror/view";
import { debounce } from "lodash";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { SupportedCodeEditorModes } from "../../extensions/codemirror/hooks/useCodemirrorModeExtension.hooks";

import { ContextOverlay, FieldItem, IconButton, Spinner, Toolbar, ToolbarSection } from "./../../";
import { markText, removeMarkFromText } from "./extensions/markText";
import { AutoSuggestionList } from "./AutoSuggestionList";
//custom components
import ExtendedCodeEditor, { IRange } from "./ExtendedCodeEditor";

const EXTRA_VERTICAL_PADDING = 10;

export enum OVERWRITTEN_KEYS {
    ArrowUp = "ArrowUp",
    ArrowDown = "ArrowDown",
    Enter = "Enter",
    Tab = "Tab",
    Escape = "Escape",
}
export type OverwrittenKeyTypes = (typeof OVERWRITTEN_KEYS)[keyof typeof OVERWRITTEN_KEYS];

/** A single suggestion. */
export interface CodeAutocompleteFieldSuggestionBase {
    // The actual value
    value: string;
    // Optional human-readable label
    label?: string;
    // Optional description of the value.
    description?: string;
}

/** @deprecated (v25) use CodeAutocompleteFieldSuggestionBase */
export type ISuggestionBase = CodeAutocompleteFieldSuggestionBase;

/** Same as CodeAutocompleteFieldSuggestionBase, but with the query that was used to fetch this suggestion. */
export interface CodeAutocompleteFieldSuggestionWithReplacementInfo extends CodeAutocompleteFieldSuggestionBase {
    // The query this result was filtered by
    query: string;
    // The offset of the original string that should be replaced
    from: number;
    // The length of the original string that should be replaced
    length: number;
}

/** @deprecated (v25) use CodeAutocompleteFieldSuggestionWithReplacementInfo */
export type ISuggestionWithReplacementInfo = CodeAutocompleteFieldSuggestionWithReplacementInfo;

/** The suggestions for a specific substring of the given input string. */
export interface CodeAutocompleteFieldReplacementResult {
    // The range of the input string that should be replaced
    replacementInterval: {
        from: number;
        length: number;
    };
    // The extracted query from the local value at the cursor position of the path that was used to retrieve the suggestions.
    extractedQuery: string;
    // The suggested replacements for the substring that should be replaced.
    replacements: CodeAutocompleteFieldSuggestionBase[];
}

/** @deprecated (v25) use CodeAutocompleteFieldReplacementResult */
export type IReplacementResult = CodeAutocompleteFieldReplacementResult;

export interface CodeAutocompleteFieldPartialAutoCompleteResult {
    // Repeats the input string from the corresponding request
    inputString: string;
    // Repeats the cursor position from the corresponding request
    cursorPosition: number;
    replacementResults: CodeAutocompleteFieldReplacementResult[];
}

/** @deprecated (v25) use CodeAutocompleteFieldPartialAutoCompleteResult */
export type IPartialAutoCompleteResult = CodeAutocompleteFieldPartialAutoCompleteResult;

/** Validation result */
export interface CodeAutocompleteFieldValidationResult {
    // If the input value is valid or not
    valid: boolean;
    parseError?: {
        // Detail error message
        message: string;
        // Start of the parse error in the input string
        start: number;
        // End of the parse error in the input string
        end: number;
    };
}

/** @deprecated (v25) use CodeAutocompleteFieldValidationResult */
export type IValidationResult = CodeAutocompleteFieldValidationResult;

/**
 * @deprecated (v25) use `CodeAutocompleteFieldProps` instead.
 */
export interface AutoSuggestionProps {
    /** Additional class name.
     */
    className?: string;
    /** Optional label to be shown for the input (above). This will create a FieldItem around the input.
     */
    label?: string;
    /** The value the component is initialized with, do not use this to control value changes.
     */
    initialValue: string;
    /** Callback on value change
     */
    onChange: (currentValue: string) => any;
    /** Fetches the suggestions
     */
    fetchSuggestions: (
        inputString: string,
        cursorPosition: number
    ) =>
        | (CodeAutocompleteFieldPartialAutoCompleteResult | undefined)
        | Promise<CodeAutocompleteFieldPartialAutoCompleteResult | undefined>;
    /** Checks if the input is valid
     */
    checkInput?: (
        inputString: string
    ) => CodeAutocompleteFieldValidationResult | Promise<CodeAutocompleteFieldValidationResult | undefined>;
    /** Called with the input validation result
     */
    onInputChecked?: (validInput: boolean) => any;
    /** Text that should be shown if the input validation failed.
     */
    validationErrorText?: string;
    /** Text that should be shown when hovering over the clear icon
     */
    clearIconText?: string;
    /** Called when focus status changes
     */
    onFocusChange?: (hasFocus: boolean) => any;
    /** Optional ID to attach to the outer element
     */
    id?: string;
    /** If the <Tab> key should be used for auto-completing items. Else it will have its default behavior.
     */
    useTabForCompletions?: boolean;
    /** An additional element that is put to the left side of the input field */
    leftElement?: JSX.Element | null;
    /** An additional element that is put to the right side of the input field
     */
    rightElement?: JSX.Element | null;
    /** Placeholder tobe shown when no text has been entered, yet. */
    placeholder?: string;
    /** If the horizontal scrollbars should be shown. */
    showScrollBar?: boolean;
    /** Delay in ms before an auto-completion request should be send after nothing is typed in anymore.
     * This should prevent the UI to send too many requests to the backend. */
    autoCompletionRequestDelay?: number;
    /** Delay in ms before a validation request should be send after nothing is typed in anymore.
     * This should prevent the UI to send too many requests to the backend. */
    validationRequestDelay?: number;
    /**
     * multiline configuration
     */
    multiline?: boolean;
    // The editor theme, e.g. "sparql"
    mode?: SupportedCodeEditorModes;

    /** If this is enabled the value of the editor is replaced with the initialValue if it changes.
     * FIXME: This property is a workaround for some "controlled" usages of the component via the initialValue property. */
    reInitOnInitialValueChange?: boolean;
    /** Optional height of the component */
    height?: number | string;
    /** Set read-only mode. Default: false */
    readOnly?: boolean;
    /** Properties that should be added to the outer div container. */
    outerDivAttributes?: Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "data-test-id">;
}

// Meta data regarding a request
interface RequestMetaData {
    requestId: string | undefined;
}

/**
 * @deprecated (support already removed) use `CodeAutocompleteField` as replacement.
 */
const AutoSuggestion = ({
    className,
    label,
    initialValue,
    onChange,
    fetchSuggestions,
    checkInput,
    validationErrorText = "Invalid value",
    clearIconText = "Clear",
    onFocusChange,
    id,
    onInputChecked,
    leftElement,
    rightElement,
    useTabForCompletions = false,
    placeholder,
    showScrollBar = true,
    autoCompletionRequestDelay = 1000,
    validationRequestDelay = 200,
    mode,
    multiline = false,
    reInitOnInitialValueChange = false,
    height,
    readOnly,
    outerDivAttributes,
}: AutoSuggestionProps) => {
    const value = React.useRef<string>(initialValue);
    const cursorPosition = React.useRef(0);
    const dropdownXYoffset = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const [shouldShowDropdown, setShouldShowDropdown] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<CodeAutocompleteFieldSuggestionWithReplacementInfo[]>([]);
    const [suggestionsPending, setSuggestionsPending] = React.useState(false);
    const suggestionRequestData = React.useRef<RequestMetaData>({ requestId: undefined });
    const [pathValidationPending, setPathValidationPending] = React.useState(false);
    const validationRequestData = React.useRef<RequestMetaData>({ requestId: undefined });
    const errorMarkers = React.useRef<any[]>([]);
    const [validationResponse, setValidationResponse] = useState<CodeAutocompleteFieldValidationResult | undefined>(
        undefined
    );
    const [suggestionResponse, setSuggestionResponse] = useState<
        CodeAutocompleteFieldPartialAutoCompleteResult | undefined
    >(undefined);
    // The element that should be used for replacement highlighting
    const [highlightedElement, setHighlightedElement] = useState<
        CodeAutocompleteFieldSuggestionWithReplacementInfo | undefined
    >(undefined);
    const [cm, setCM] = React.useState<EditorView>();
    const currentCm = React.useRef<EditorView>();
    currentCm.current = cm;
    const isFocused = React.useRef(false);
    const autoSuggestionDivRef = React.useRef<HTMLDivElement>(null);
    /** Mutable editor state, since this needs to be current in scope of the SingleLineEditorComponent. */
    const [editorState] = React.useState<{
        index: number;
        suggestions: CodeAutocompleteFieldSuggestionWithReplacementInfo[];
        cm?: EditorView;
        dropdownShown: boolean;
    }>({ index: 0, suggestions: [], dropdownShown: false });
    /** This is for the AutoSuggestionList component in order to re-render. */
    const [focusedIndex, setFocusedIndex] = React.useState(0);
    const selectedTextRanges = React.useRef<IRange[]>([]);

    const pathIsValid = validationResponse?.valid ?? true;

    React.useEffect(() => {
        if (reInitOnInitialValueChange && initialValue != null && currentCm.current) {
            dispatch({
                changes: { from: 0, to: currentCm.current.state?.doc.length, insert: initialValue },
            });
            // Validate initial value change
            checkValuePathValidity(initialValue);
        }
    }, [initialValue, reInitOnInitialValueChange]);

    React.useEffect(() => {
        if (currentCm.current) {
            // Validate initial value
            checkValuePathValidity(initialValue);
        }
    }, [!!currentCm.current]);

    const setCurrentIndex = (newIndex: number) => {
        editorState.index = newIndex;
        setFocusedIndex(newIndex);
    };
    const currentIndex = () => editorState.index;

    React.useEffect(() => {
        editorState.cm = cm;
    }, [cm, editorState]);

    const dispatch = (
        typeof editorState?.cm?.dispatch === "function" ? editorState?.cm?.dispatch : () => {}
    ) as EditorView["dispatch"];

    React.useEffect(() => {
        editorState.dropdownShown = shouldShowDropdown;
    }, [shouldShowDropdown, editorState]);

    // Handle replacement highlighting
    useEffect(() => {
        if (highlightedElement && cm) {
            const { from, length } = highlightedElement;
            if (length > 0 && selectedTextRanges.current.length === 0) {
                const to = from + length;
                const { toOffset, fromOffset } = getOffsetRange(cm, from, to);
                markText({
                    view: cm,
                    from: fromOffset,
                    to: toOffset,
                    className: `${eccgui}-autosuggestion__text--highlighted`,
                });
                return () => removeMarkFromText({ view: cm, from, to });
            }
        } else {
            if (cm) {
                removeMarkFromText({ view: cm, from: 0, to: cm.state?.doc.length });
            }
        }
        return;
    }, [highlightedElement, selectedTextRanges, cm]);

    //handle linting
    React.useEffect(() => {
        const parseError = validationResponse?.parseError;
        if (cm) {
            const clearCurrentErrorMarker = () => {
                if (errorMarkers.current.length) {
                    const [from, to] = errorMarkers.current;
                    removeMarkFromText({ view: cm, from, to });
                    errorMarkers.current = [];
                }
            };
            if (parseError) {
                const { message, start, end } = parseError;
                const { toOffset, fromOffset } = getOffsetRange(cm, start, end);
                clearCurrentErrorMarker();
                const { from, to } = markText({
                    view: cm,
                    from: fromOffset,
                    to: toOffset,
                    className: `${eccgui}-autosuggestion__text--highlighted-error`,
                    title: message,
                });
                errorMarkers.current = [from, to];
            } else {
                clearCurrentErrorMarker();
            }
        }

        const isValid = validationResponse?.valid === undefined || validationResponse.valid;
        onInputChecked?.(isValid);
    }, [validationResponse?.valid, validationResponse?.parseError, cm, onInputChecked]);

    /** generate suggestions and also populate the replacement indexes dict */
    React.useEffect(() => {
        let newSuggestions: CodeAutocompleteFieldSuggestionWithReplacementInfo[] = [];
        if (
            suggestionResponse?.replacementResults?.length === 1 &&
            !suggestionResponse?.replacementResults[0]?.replacements?.length
        ) {
            setShouldShowDropdown(false);
        }
        if (suggestionResponse?.replacementResults?.length) {
            suggestionResponse.replacementResults.forEach(
                ({ replacements, replacementInterval: { from, length }, extractedQuery }) => {
                    const replacementsWithMetaData = replacements.map((r) => ({
                        ...r,
                        query: extractedQuery,
                        from,
                        length,
                    }));
                    newSuggestions = [...newSuggestions, ...replacementsWithMetaData];
                }
            );
            editorState.suggestions = newSuggestions;
            setSuggestions(newSuggestions);
        } else {
            editorState.suggestions = [];
            setSuggestions([]);
        }
        setCurrentIndex(0);
    }, [suggestionResponse, editorState]);

    const getOffsetRange = (cm: EditorView, from: number, to: number) => {
        if (!cm) return { fromOffset: 0, toOffset: 0 };
        const cursor = cm.state.selection.main.head;
        const cursorLine = cm.state.doc.lineAt(cursor).number;
        const offsetFromFirstLine = cm.state.doc.line(cursorLine).from; //all characters including line breaks
        const fromOffset = offsetFromFirstLine + from;
        const toOffset = offsetFromFirstLine + to;

        return { fromOffset, toOffset };
    };

    const inputActionsDisplayed = React.useCallback((node) => {
        if (!node) return;
        const width = node.offsetWidth;
        const slCodeEditor = node.parentElement.getElementsByClassName(`${eccgui}-singlelinecodeeditor`);
        if (slCodeEditor.length > 0) {
            slCodeEditor[0].style.paddingRight = `${width}px`;
        }
    }, []);

    const asyncCheckInput = useMemo(
        () => async (inputString: string) => {
            if (
                !checkInput ||
                inputString !== value.current ||
                validationRequestData.current.requestId === inputString
            ) {
                return;
            }
            validationRequestData.current.requestId = inputString;
            setPathValidationPending(true);
            try {
                const result: CodeAutocompleteFieldValidationResult | undefined = await checkInput(inputString);
                setValidationResponse(result);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                setValidationResponse(undefined);
                // TODO: Error handling
            } finally {
                setPathValidationPending(false);
            }
        },
        [checkInput]
    );

    const checkValuePathValidity = useMemo(
        () => debounce((inputString: string) => asyncCheckInput(inputString), validationRequestDelay),
        [asyncCheckInput, validationRequestDelay]
    );

    const asyncHandleEditorInputChange = useMemo(
        () => async (inputString: string, cursorPosition: number) => {
            const requestId = `${inputString} ${cursorPosition}`;
            if (requestId === suggestionRequestData.current.requestId || !editorState?.cm) {
                return;
            }
            suggestionRequestData.current.requestId = requestId;
            setSuggestionsPending(true);
            try {
                const cursor = editorState?.cm.state.selection.main.head; ///actual cursor position
                const cursorLine = editorState?.cm.state.doc.lineAt(cursor ?? 0).number;
                if (cursorLine) {
                    const result: CodeAutocompleteFieldPartialAutoCompleteResult | undefined = await fetchSuggestions(
                        inputString.split("\n")[cursorLine - 1], //line starts from 1
                        cursorPosition
                    );
                    if (value.current === inputString) {
                        setSuggestionResponse(result);
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                setSuggestionResponse(undefined);
                // TODO: Error handling
            } finally {
                setSuggestionsPending(false);
            }
        },
        [fetchSuggestions, cm]
    );

    const handleEditorInputChange = useMemo(
        () =>
            debounce(
                (inputString: string, cursorPosition: number) =>
                    asyncHandleEditorInputChange(inputString, cursorPosition),
                autoCompletionRequestDelay
            ),
        [asyncHandleEditorInputChange, autoCompletionRequestDelay]
    );

    const handleChange = React.useMemo(() => {
        return (val: string) => {
            value.current = val;
            checkValuePathValidity.cancel();
            checkValuePathValidity(value.current);
            onChange(val);
        };
    }, [onChange, checkValuePathValidity]);

    const handleCursorChange = (cursor: number, coords: Rect, scrollinfo: HTMLElement, view: EditorView) => {
        //cursor here is offset from line 1, autosuggestion works with cursor per-line.
        // derived cursor is current cursor position - start of line of cursor
        const cursorLine = view.state.doc.lineAt(cursor).number;
        const offsetFromFirstLine = view.state.doc.line(cursorLine).from; //;
        cursorPosition.current = cursor - offsetFromFirstLine;
        // cursor change is fired after onChange, so we put the auto-complete logic here
        //get value at line
        if (isFocused.current) {
            setShouldShowDropdown(true);
            handleEditorInputChange.cancel();
            handleEditorInputChange(value.current, cursorPosition.current);
        }

        setTimeout(() => {
            dropdownXYoffset.current = {
                x: Math.min(coords.left, Math.max(coords.left - scrollinfo?.scrollLeft, 0)),
                y: multiline
                    ? Math.min(coords.bottom, Math.max(coords.bottom - scrollinfo?.scrollTop, 0)) +
                      EXTRA_VERTICAL_PADDING
                    : 0,
            };
        }, 1);
    };

    const handleInputEditorKeyPress = (event: KeyboardEvent) => {
        const overWrittenKeys: Array<string> = Object.values(OVERWRITTEN_KEYS);
        if (overWrittenKeys.includes(event.key) && (useTabForCompletions || event.key !== OVERWRITTEN_KEYS.Tab)) {
            //don't prevent when enter should create new line (multiline config) and dropdown isn't shown
            const allowDefaultEnterKeyPressBehavior = multiline && !editorState.suggestions.length;
            const overwrittenKey = OVERWRITTEN_KEYS[event.key as keyof typeof OVERWRITTEN_KEYS];
            if (!allowDefaultEnterKeyPressBehavior) {
                event.preventDefault();
                makeDropDownRespondToKeyPress(overwrittenKey);
                return true; //prevent new line
            }
            makeDropDownRespondToKeyPress(overwrittenKey);
            return false; // allow new line if enter
        }
        return true;
    };

    const closeDropDown = () => {
        setHighlightedElement(undefined);
        setShouldShowDropdown(false);
    };

    const handleDropdownChange = (selectedSuggestion: CodeAutocompleteFieldSuggestionWithReplacementInfo) => {
        if (selectedSuggestion && editorState.cm) {
            const { from, length, value } = selectedSuggestion;
            // const cursor = editorState.editorInstance.getCursor();
            const cursor = editorState.cm?.state.selection.main.head;
            const to = from + length;

            const { fromOffset, toOffset } = getOffsetRange(editorState.cm, from, to);
            editorState.cm.dispatch({
                changes: {
                    from: fromOffset,
                    to: toOffset,
                    insert: value,
                },
            });
            closeDropDown();
            const cursorLine = editorState.cm.state.doc.lineAt(cursor).number;
            const newCursorPos = editorState.cm.state.doc.line(cursorLine).from + (from + value.length);

            editorState.cm.dispatch({ selection: { anchor: newCursorPos } });
            editorState.cm.focus();
        }
    };

    const handleInputEditorClear = () => {
        dispatch({
            changes: { from: 0, to: cm?.state.doc.length, insert: "" },
        });
        cursorPosition.current = 0;
        handleChange("");
        cm?.focus();
    };

    const handleInputFocus = (focusState: boolean) => {
        onFocusChange?.(focusState);
        if (focusState) {
            setShouldShowDropdown(true);
        } else {
            closeDropDown();
        }

        if (!isFocused.current && focusState) {
            // Just got focus
            // Clear suggestions and repeat suggestion request, something else might have changed while this component was not focused
            setSuggestions([]);
            suggestionRequestData.current.requestId = undefined;
            isFocused.current = focusState;
            handleEditorInputChange.cancel();
            handleEditorInputChange(value.current, cursorPosition.current);
        } else {
            isFocused.current = focusState;
        }
    };

    const handleInputMouseDown = React.useCallback((editor: EditorView) => {
        const cursor = editorState.cm?.state.selection.main.head;
        const currentLine = editorState.cm?.state.doc.lineAt(cursor ?? 0).number;
        const clickedLine = editor?.state.doc.lineAt(cursor ?? 0).number;
        //Clicking on a different line other than the current line
        //where the dropdown already suggests should close the dropdown
        if (currentLine !== clickedLine) {
            closeDropDown();
            editorState.suggestions = [];
            setSuggestions([]);
        }
    }, []);

    //keyboard handlers
    const handleArrowDown = () => {
        const lastSuggestionIndex = editorState.suggestions.length - 1;
        setCurrentIndex(currentIndex() === lastSuggestionIndex ? 0 : currentIndex() + 1);
    };

    const handleArrowUp = () => {
        const lastSuggestionIndex = editorState.suggestions.length - 1;
        setCurrentIndex(currentIndex() === 0 ? lastSuggestionIndex : currentIndex() - 1);
    };

    const handleEnterPressed = () => {
        handleDropdownChange(editorState.suggestions[currentIndex()]);
        setCurrentIndex(0);
    };

    const handleTabPressed = () => {
        handleDropdownChange(editorState.suggestions[currentIndex()]);
    };

    const handleEscapePressed = () => {
        closeDropDown();
        editorState.suggestions = [];
        setSuggestions([]);
    };

    const makeDropDownRespondToKeyPress = (keyPressedFromInput: OverwrittenKeyTypes) => {
        // React state unknown
        if (editorState.dropdownShown) {
            switch (keyPressedFromInput) {
                case OVERWRITTEN_KEYS.ArrowUp:
                    handleArrowUp();
                    break;
                case OVERWRITTEN_KEYS.ArrowDown:
                    handleArrowDown();
                    break;
                case OVERWRITTEN_KEYS.Enter:
                    handleEnterPressed();
                    break;
                case OVERWRITTEN_KEYS.Tab:
                    handleTabPressed();
                    break;
                case OVERWRITTEN_KEYS.Escape:
                    handleEscapePressed();
                    break;
                default:
                    //do nothing
                    closeDropDown();
            }
        }
    };

    const handleItemHighlighting = React.useCallback(
        (item: CodeAutocompleteFieldSuggestionWithReplacementInfo | undefined) => {
            setHighlightedElement(item);
        },
        []
    );

    const onSelection = React.useMemo(
        () => (ranges: IRange[]) => {
            selectedTextRanges.current = ranges;
        },
        []
    );

    const codeEditor = React.useMemo(() => {
        return (
            <ExtendedCodeEditor
                mode={mode}
                setCM={setCM}
                onChange={handleChange}
                onCursorChange={handleCursorChange}
                initialValue={initialValue}
                onFocusChange={handleInputFocus}
                onKeyDown={handleInputEditorKeyPress}
                enableTab={useTabForCompletions}
                placeholder={placeholder}
                onSelection={onSelection}
                showScrollBar={showScrollBar}
                multiline={multiline}
                onMouseDown={handleInputMouseDown}
                height={height}
                readOnly={readOnly}
            />
        );
    }, [
        mode,
        setCM,
        handleChange,
        initialValue,
        useTabForCompletions,
        placeholder,
        showScrollBar,
        multiline,
        handleInputMouseDown,
        readOnly,
    ]);

    const hasError = !!value.current && !pathIsValid && !pathValidationPending;
    const autoSuggestionInput = (
        <div
            id={id}
            ref={autoSuggestionDivRef}
            className={`${eccgui}-autosuggestion` + (className ? ` ${className}` : "")}
            {...outerDivAttributes}
        >
            <div
                className={` ${eccgui}-autosuggestion__inputfield ${BlueprintClassNames.INPUT_GROUP} ${
                    BlueprintClassNames.FILL
                } ${hasError ? BlueprintClassNames.INTENT_DANGER : ""}`}
            >
                <ContextOverlay
                    minimal
                    fill
                    isOpen={shouldShowDropdown}
                    placement="bottom-start"
                    modifiers={{ flip: { enabled: false } }}
                    openOnTargetFocus={false}
                    autoFocus={false}
                    content={
                        <AutoSuggestionList
                            id={id + "__dropdown"}
                            offsetValues={dropdownXYoffset.current}
                            loading={suggestionsPending}
                            options={suggestions}
                            isOpen={!suggestionsPending && shouldShowDropdown}
                            onItemSelectionChange={handleDropdownChange}
                            currentlyFocusedIndex={focusedIndex}
                            itemToHighlight={handleItemHighlighting}
                        />
                    }
                >
                    {codeEditor}
                </ContextOverlay>
                {!!value.current && (
                    <span className={BlueprintClassNames.INPUT_ACTION} ref={inputActionsDisplayed}>
                        <IconButton
                            data-test-id={"value-path-clear-btn"}
                            name="operation-clear"
                            text={clearIconText}
                            disabled={readOnly}
                            onClick={handleInputEditorClear}
                        />
                    </span>
                )}
            </div>
        </div>
    );

    const withRightElement =
        rightElement || leftElement ? (
            <Toolbar noWrap>
                {leftElement && <ToolbarSection>{leftElement}</ToolbarSection>}
                <ToolbarSection canGrow canShrink>
                    <div style={{ minWidth: "100%", maxWidth: "100%" }}>{autoSuggestionInput}</div>
                </ToolbarSection>
                {rightElement && <ToolbarSection>{rightElement}</ToolbarSection>}
            </Toolbar>
        ) : (
            autoSuggestionInput
        );

    return label ? (
        <FieldItem
            labelProps={{
                text: (
                    <>
                        {label}
                        &nbsp;
                        {(pathValidationPending || suggestionsPending) && (
                            <Spinner size="tiny" position="inline" description="Validating value path" />
                        )}
                    </>
                ),
            }}
            intent={hasError ? "danger" : undefined}
            messageText={hasError ? validationErrorText : undefined}
        >
            {withRightElement}
        </FieldItem>
    ) : (
        withRightElement
    );
};

export default AutoSuggestion;
