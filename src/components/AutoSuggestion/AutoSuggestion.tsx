import React, { useEffect, useMemo, useState } from "react";
import { Classes as BlueprintClassNames } from "@blueprintjs/core";
import { Rect } from "@uiw/react-codemirror";
import { EditorView } from "codemirror";
import { debounce } from "lodash";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { SupportedCodeEditorModes } from "../../extensions/codemirror/hooks/useCodemirrorModeExtension.hooks";

import { ContextOverlay, FieldItem, IconButton, Spinner, Toolbar, ToolbarSection } from "./../../";
import { markText, removeMarkFromText } from "./extensions/markText";
import { AutoSuggestionList } from "./AutoSuggestionList";
//custom components
import ExtendedCodeEditor, { IRange } from "./ExtendedCodeEditor";

const LINE_COLUMN_WIDTH = 29;
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
export interface ISuggestionBase {
    // The actual value
    value: string;
    // Optional human-readable label
    label?: string;
    // Optional description of the value.
    description?: string;
}

/** Same as ISuggestionBase, but with the query that was used to fetch this suggestion. */
export interface ISuggestionWithReplacementInfo extends ISuggestionBase {
    // The query this result was filtered by
    query: string;
    // The offset of the original string that should be replaced
    from: number;
    // The length of the original string that should be replaced
    length: number;
}

/** The suggestions for a specific substring of the given input string. */
export interface IReplacementResult {
    // The range of the input string that should be replaced
    replacementInterval: {
        from: number;
        length: number;
    };
    // The extracted query from the local value at the cursor position of the path that was used to retrieve the suggestions.
    extractedQuery: string;
    // The suggested replacements for the substring that should be replaced.
    replacements: ISuggestionBase[];
}

export interface IPartialAutoCompleteResult {
    // Repeats the input string from the corresponding request
    inputString: string;
    // Repeats the cursor position from the corresponding request
    cursorPosition: number;
    replacementResults: IReplacementResult[];
}

/** Validation result */
export interface IValidationResult {
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
    ) => (IPartialAutoCompleteResult | undefined) | Promise<IPartialAutoCompleteResult | undefined>;
    /** Checks if the input is valid
     */
    checkInput?: (inputString: string) => IValidationResult | Promise<IValidationResult | undefined>;
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
}

// @deprecated
export type IProps = AutoSuggestionProps;

// Meta data regarding a request
interface RequestMetaData {
    requestId: string | undefined;
}

/**
 * **Element is deprecated.**
 * Use `CodeAutocompleteField` as replacement.
 *
 * @deprecated
 */
export const AutoSuggestion = ({
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
}: AutoSuggestionProps) => {
    const value = React.useRef<string>(initialValue);
    const cursorPosition = React.useRef(0);
    const dropdownXYoffset = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const [shouldShowDropdown, setShouldShowDropdown] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<ISuggestionWithReplacementInfo[]>([]);
    const [suggestionsPending, setSuggestionsPending] = React.useState(false);
    const suggestionRequestData = React.useRef<RequestMetaData>({ requestId: undefined });
    const [pathValidationPending, setPathValidationPending] = React.useState(false);
    const validationRequestData = React.useRef<RequestMetaData>({ requestId: undefined });
    const [, setErrorMarkers] = React.useState<any[]>([]);
    const [validationResponse, setValidationResponse] = useState<IValidationResult | undefined>(undefined);
    const [suggestionResponse, setSuggestionResponse] = useState<IPartialAutoCompleteResult | undefined>(undefined);
    // The element that should be used for replacement highlighting
    const [highlightedElement, setHighlightedElement] = useState<ISuggestionWithReplacementInfo | undefined>(undefined);
    const [cm, setCM] = React.useState<EditorView>();
    const isFocused = React.useRef(false);
    const autoSuggestionDivRef = React.useRef<HTMLDivElement>(null);
    /** Mutable editor state, since this needs to be current in scope of the SingleLineEditorComponent. */
    const [editorState] = React.useState<{
        index: number;
        suggestions: ISuggestionWithReplacementInfo[];
        cm?: EditorView;
        dropdownShown: boolean;
    }>({ index: 0, suggestions: [], dropdownShown: false });
    /** This is for the AutoSuggestionList component in order to re-render. */
    const [focusedIndex, setFocusedIndex] = React.useState(0);
    const selectedTextRanges = React.useRef<IRange[]>([]);

    const pathIsValid = validationResponse?.valid ?? true;

    const setCurrentIndex = (newIndex: number) => {
        editorState.index = newIndex;
        setFocusedIndex(newIndex);
    };
    const currentIndex = () => editorState.index;

    React.useEffect(() => {
        editorState.cm = cm;
    }, [cm, editorState]);

    React.useEffect(() => {
        if (initialValue != null) {
            cm?.dispatch({
                changes: { from: 0, to: cm.state.doc.length, insert: initialValue },
            });
        }
    }, [initialValue, cm]);

    React.useEffect(() => {
        editorState.dropdownShown = shouldShowDropdown;
    }, [shouldShowDropdown, editorState]);

    // Handle replacement highlighting
    useEffect(() => {
        if (highlightedElement && cm) {
            const { from, length } = highlightedElement;
            if (length > 0 && selectedTextRanges.current.length === 0) {
                const to = from + length;
                const { toOffset, fromOffset } = getOffsetRange(from, to);
                markText({
                    view: cm,
                    from: fromOffset,
                    to: toOffset,
                    className: `${eccgui}-autosuggestion__text--highlighted`,
                });
                return () => removeMarkFromText({ view: cm, from, to });
            }
        }
        return;
    }, [highlightedElement, selectedTextRanges, cm]);

    //handle linting
    React.useEffect(() => {
        const parseError = validationResponse?.parseError;
        if (cm) {
            if (parseError) {
                const { message, start, end } = parseError;
                const { toOffset, fromOffset } = getOffsetRange(start, end);
                const { from, to } = markText({
                    view: cm,
                    from: fromOffset,
                    to: toOffset,
                    className: `${eccgui}-autosuggestion__text--highlighted-error`,
                    title: message,
                });

                setErrorMarkers((previousMarkers) => {
                    previousMarkers.forEach((m) => removeMarkFromText({ view: cm, from: m.from, to: m.to }));
                    return [from, to];
                });
            } else {
                // Valid, clear all error markers
                setErrorMarkers((previous) => {
                    previous.forEach((m) => removeMarkFromText({ view: cm, from: m.from, to: m.to }));
                    return [];
                });
            }
        }

        const isValid = validationResponse?.valid === undefined || validationResponse.valid;
        onInputChecked && onInputChecked(isValid);
    }, [validationResponse?.valid, validationResponse?.parseError, cm, onInputChecked]);

    /** generate suggestions and also populate the replacement indexes dict */
    React.useEffect(() => {
        let newSuggestions: ISuggestionWithReplacementInfo[] = [];
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
        editorState.index = 0;
    }, [suggestionResponse, editorState]);

    const getOffsetRange = (from: number, to: number) => {
        if (!cm) return { fromOffset: 0, toOffset: 0 };
        const cursor = cm.state.selection.main.head;
        const cursorLine = cm.state.doc.lineAt(cursor).number;
        const fromOffset = cm.state.doc.line(cursorLine).from + from;
        const toOffset = cm.state.doc.line(cursorLine).from + to;

        return { fromOffset, toOffset };
    };

    const inputactionsDisplayed = React.useCallback((node) => {
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
                const result: IValidationResult | undefined = await checkInput(inputString);
                setValidationResponse(result);
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
            if (requestId === suggestionRequestData.current.requestId) {
                return;
            }
            suggestionRequestData.current.requestId = requestId;
            setSuggestionsPending(true);
            try {
                // const pos = editorState?.cm.state.selection.main.head;
                const cursor = cm?.state.selection.main.head;
                const cursorLine = cm?.state.doc.lineAt(cursor ?? 0).number;
                if (cursorLine) {
                    const result: IPartialAutoCompleteResult | undefined = await fetchSuggestions(
                        inputString.split("\n")[cursorLine - 1], //line starts from 1
                        cursorPosition
                    );
                    if (value.current === inputString) {
                        setSuggestionResponse(result);
                    }
                }
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

    const handleChange = (val: string) => {
        value.current = val;
        checkValuePathValidity.cancel();
        checkValuePathValidity(value.current);
        onChange(val);
    };

    const handleCursorChange = (cursor: number, coords: Rect, scrollinfo: HTMLElement) => {
        cursorPosition.current = cursor;
        // cursor change is fired after onChange, so we put the auto-complete logic here
        if (isFocused.current) {
            setShouldShowDropdown(true);
            handleEditorInputChange.cancel();
            handleEditorInputChange(value.current, cursorPosition.current);
        }

        const boxOffsetHeight = autoSuggestionDivRef.current?.offsetHeight ?? 0;

        setTimeout(() => {
            dropdownXYoffset.current = {
                x:
                    Math.min(coords.left, Math.max(coords.left - scrollinfo?.scrollLeft, 0)) +
                    (multiline ? LINE_COLUMN_WIDTH : 0),
                y: multiline
                    ? -(boxOffsetHeight - Math.min(coords.bottom, Math.max(coords.bottom - scrollinfo?.scrollTop, 0))) +
                      EXTRA_VERTICAL_PADDING
                    : 0,
            };
        }, 1);
    };

    //todo check out typings for event type
    const handleInputEditorKeyPress = (event: any) => {
        const overWrittenKeys: Array<string> = Object.values(OVERWRITTEN_KEYS);
        if (overWrittenKeys.includes(event.key) && (useTabForCompletions || event.key !== OVERWRITTEN_KEYS.Tab)) {
            //don't prevent when enter should create new line (multiline config) and dropdown isn't shown
            const allowDefaultEnterKeyPressBehavior = multiline && !editorState.suggestions.length;
            if (!allowDefaultEnterKeyPressBehavior) {
                event.preventDefault();
            }
            makeDropDownRespondToKeyPress(OVERWRITTEN_KEYS[event.key as keyof typeof OVERWRITTEN_KEYS]);
        }
    };

    const closeDropDown = () => {
        setHighlightedElement(undefined);
        setShouldShowDropdown(false);
    };

    const handleDropdownChange = (selectedSuggestion: ISuggestionWithReplacementInfo) => {
        if (selectedSuggestion && editorState.cm) {
            const { from, length, value } = selectedSuggestion;
            // const cursor = editorState.editorInstance.getCursor();
            const cursor = editorState.cm?.state.selection.main.head;
            const to = from + length;

            const { fromOffset, toOffset } = getOffsetRange(from, to);
            editorState.cm.dispatch({
                changes: {
                    from: fromOffset,
                    to: toOffset,
                    insert: selectedSuggestion.value,
                },
            });
            // editorState.editorInstance.replaceRange(
            //     selectedSuggestion.value,
            //     { line: cursor.line, ch: from },
            //     { line: cursor.line, ch: to }
            // );
            closeDropDown();
            const cursorLine = editorState.cm.state.doc.lineAt(cursor).number;
            const newCursorPos = editorState.cm.state.doc.line(cursorLine).from + (from + value.length);

            editorState.cm.dispatch({ selection: { anchor: newCursorPos } });
            // editorState.editorInstance.setCursor({ line: cursor.line, ch: from + value.length });
            // editorState.editorInstance.focus();
            editorState.cm.focus();
        }
    };

    const handleInputEditorClear = () => {
        // editorInstance?.setValue("");
        cm?.dispatch({
            changes: { from: 0, to: cm.state.doc.length, insert: "" },
        });
        cursorPosition.current = 0;
        handleChange("");
        // editorInstance?.focus();
        cm?.focus();
    };

    const handleInputFocus = (focusState: boolean) => {
        onFocusChange && onFocusChange(focusState);
        focusState ? setShouldShowDropdown(true) : closeDropDown();
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
        // const currentLine = editorState.editorInstance?.getCursor()?.line;
        // const clickedLine = editor.getCursor()?.line;
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
            }
        }
    };

    const handleItemHighlighting = React.useCallback((item: ISuggestionWithReplacementInfo | undefined) => {
        setHighlightedElement(item);
    }, []);

    const onSelection = React.useMemo(
        () => (ranges: IRange[]) => {
            selectedTextRanges.current = ranges;
        },
        []
    );

    const hasError = !!value.current && !pathIsValid && !pathValidationPending;
    const autoSuggestionInput = (
        <div
            id={id}
            ref={autoSuggestionDivRef}
            className={`${eccgui}-autosuggestion` + (className ? ` ${className}` : "")}
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
                    />
                </ContextOverlay>
                {!!value.current && (
                    <span className={BlueprintClassNames.INPUT_ACTION} ref={inputactionsDisplayed}>
                        <IconButton
                            data-test-id={"value-path-clear-btn"}
                            name="operation-clear"
                            text={clearIconText}
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
            hasStateDanger={hasError}
            messageText={hasError ? validationErrorText : undefined}
        >
            {withRightElement}
        </FieldItem>
    ) : (
        withRightElement
    );
};

export default AutoSuggestion;
