import React, { useEffect, useMemo, useState } from "react";
import { Classes as BlueprintClassNames } from "@blueprintjs/core";
import CodeMirror, { Position } from "codemirror";
import { debounce } from "lodash";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { ContextOverlay, FieldItem, IconButton, Spinner, Toolbar, ToolbarSection } from "./../../";
import { AutoSuggestionList } from "./AutoSuggestionList";
//custom components
import SingleLineCodeEditor, { IRange } from "./SingleLineCodeEditor";

const LINE_COLUMN_WIDTH = 29;
const EXTRA_VERTICAL_PADDING = 20;

export enum OVERWRITTEN_KEYS {
    ArrowUp = "ArrowUp",
    ArrowDown = "ArrowDown",
    Enter = "Enter",
    Tab = "Tab",
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
    mode?: string;
}

// @deprecated
export type IProps = AutoSuggestionProps;

// Meta data regarding a request
interface RequestMetaData {
    requestId: string | undefined;
}

type HorizontalShiftCallbackFunction = (shift: number) => any;

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
    mode = "null",
    multiline = false,
}: AutoSuggestionProps) => {
    const value = React.useRef<string>(initialValue);
    const cursorPosition = React.useRef(0);
    const horizontalShiftSubscriber = React.useRef<HorizontalShiftCallbackFunction | undefined>(undefined);
    const verticalShiftSubscriber = React.useRef<HorizontalShiftCallbackFunction | undefined>(undefined);
    const [shouldShowDropdown, setShouldShowDropdown] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<ISuggestionWithReplacementInfo[]>([]);
    const [suggestionsPending, setSuggestionsPending] = React.useState(false);
    const suggestionRequestData = React.useRef<RequestMetaData>({ requestId: undefined });
    const [pathValidationPending, setPathValidationPending] = React.useState(false);
    const validationRequestData = React.useRef<RequestMetaData>({ requestId: undefined });
    const [, setErrorMarkers] = React.useState<CodeMirror.TextMarker[]>([]);
    const [validationResponse, setValidationResponse] = useState<IValidationResult | undefined>(undefined);
    const [suggestionResponse, setSuggestionResponse] = useState<IPartialAutoCompleteResult | undefined>(undefined);
    // The element that should be used for replacement highlighting
    const [highlightedElement, setHighlightedElement] = useState<ISuggestionWithReplacementInfo | undefined>(undefined);
    const [editorInstance, setEditorInstance] = React.useState<CodeMirror.Editor>();
    const isFocused = React.useRef(false);
    const autoSuggestionDivRef = React.useRef<HTMLDivElement>(null);
    /** Mutable editor state, since this needs to be current in scope of the SingleLineEditorComponent. */
    const [editorState] = React.useState<{
        index: number;
        suggestions: ISuggestionWithReplacementInfo[];
        editorInstance?: CodeMirror.Editor;
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
        editorState.editorInstance = editorInstance;
    }, [editorInstance, editorState]);

    React.useEffect(() => {
        if (initialValue != null) {
            editorInstance?.setValue(initialValue);
        }
    }, [initialValue, editorInstance]);

    React.useEffect(() => {
        editorState.dropdownShown = shouldShowDropdown;
    }, [shouldShowDropdown, editorState]);

    // Handle replacement highlighting
    useEffect(() => {
        if (highlightedElement && editorInstance) {
            const { from, length } = highlightedElement;
            if (length > 0 && selectedTextRanges.current.length === 0) {
                const to = from + length;
                const marker = editorInstance.markText(
                    { line: 0, ch: from },
                    { line: 0, ch: to },
                    { className: `${eccgui}-autosuggestion__text--highlighted` }
                );
                return () => marker.clear();
            }
        }
        return;
    }, [highlightedElement, selectedTextRanges, editorInstance]);

    //handle linting
    React.useEffect(() => {
        const parseError = validationResponse?.parseError;
        if (parseError && editorInstance) {
            const { message, start, end } = parseError;
            editorInstance.getDoc().getEditor();
            const marker = editorInstance.markText(
                { line: 0, ch: start },
                { line: 0, ch: end },
                { className: `${eccgui}-autosuggestion__text--highlighted-error`, title: message }
            );
            setErrorMarkers((previousMarkers) => {
                previousMarkers.forEach((marker) => marker.clear());
                return [marker];
            });
        } else {
            // Valid, clear all error markers
            setErrorMarkers((previous) => {
                previous.forEach((marker) => marker.clear());
                return [];
            });
        }
        const isValid = validationResponse?.valid === undefined || validationResponse.valid;
        onInputChecked && onInputChecked(isValid);
    }, [validationResponse?.valid, validationResponse?.parseError, editorInstance, onInputChecked]);

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
                const result: IPartialAutoCompleteResult | undefined = await fetchSuggestions(
                    inputString,
                    cursorPosition
                );
                if (value.current === inputString) {
                    setSuggestionResponse(result);
                }
            } catch (e) {
                setSuggestionResponse(undefined);
                // TODO: Error handling
            } finally {
                setSuggestionsPending(false);
            }
        },
        [fetchSuggestions]
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

    const handleCursorChange = (pos: Position, coords: any, scrollinfo: any) => {
        cursorPosition.current = pos.ch;
        // cursor change is fired after onChange, so we put the auto-complete logic here
        if (isFocused.current) {
            setShouldShowDropdown(true);
            handleEditorInputChange.cancel();
            handleEditorInputChange(value.current, cursorPosition.current);
        }
        horizontalShiftSubscriber.current &&
            horizontalShiftSubscriber.current(
                Math.min(coords.left, Math.max(coords.left - scrollinfo.left, 0)) + (multiline ? LINE_COLUMN_WIDTH : 0)
            );
        const boxOffsetHeight = autoSuggestionDivRef.current?.offsetHeight ?? 0;
        verticalShiftSubscriber.current &&
            verticalShiftSubscriber.current(
                boxOffsetHeight -
                    Math.min(coords.bottom, Math.max(coords.bottom - scrollinfo.top, 0) + EXTRA_VERTICAL_PADDING)
            );
    };

    const handleInputEditorKeyPress = (event: KeyboardEvent) => {
        const overWrittenKeys: Array<string> = Object.values(OVERWRITTEN_KEYS);
        if (overWrittenKeys.includes(event.key) && (useTabForCompletions || event.key !== OVERWRITTEN_KEYS.Tab)) {
            event.preventDefault();
            makeDropDownRespondToKeyPress(OVERWRITTEN_KEYS[event.key as keyof typeof OVERWRITTEN_KEYS]);
        }
    };

    const closeDropDown = () => {
        setHighlightedElement(undefined);
        setShouldShowDropdown(false);
    };

    const handleDropdownChange = (selectedSuggestion: ISuggestionWithReplacementInfo) => {
        if (selectedSuggestion && editorState.editorInstance) {
            const { from, length, value } = selectedSuggestion;
            const cursor = editorState.editorInstance.getCursor();
            const to = from + length;
            editorState.editorInstance.replaceRange(
                selectedSuggestion.value,
                { line: cursor.line, ch: from },
                { line: cursor.line, ch: to }
            );
            closeDropDown();
            editorState.editorInstance.setCursor({ line: cursor.line, ch: from + value.length });
            editorState.editorInstance.focus();
        }
    };

    const handleInputEditorClear = () => {
        editorInstance?.setValue("");
        cursorPosition.current = 0;
        handleChange("");
        editorInstance?.focus();
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
                default:
                //do nothing
            }
        } else {
            if (multiline && editorState.editorInstance && keyPressedFromInput === OVERWRITTEN_KEYS.Enter) {
                // Insert a newline character ('\n') at the cursor position
                const cursor = editorState.editorInstance.getCursor();
                const line = editorState.editorInstance.getLine(cursor.line);
                const newPosition = { line: cursor.line + 1, ch: 0 };
                editorState.editorInstance.replaceRange("\n", { line: cursor.line, ch: line.length }, newPosition);
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

    const subscribeToHorizontalShift = React.useMemo(
        () => (callback: HorizontalShiftCallbackFunction) => {
            horizontalShiftSubscriber.current = callback;
        },
        []
    );

    const subscribeToVerticalShift = React.useMemo(
        () => (callback: HorizontalShiftCallbackFunction) => {
            if (multiline) {
                verticalShiftSubscriber.current = callback;
            }
        },
        [multiline]
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
                    openOnTargetFocus={false}
                    autoFocus={false}
                    content={
                        <AutoSuggestionList
                            id={id + "__dropdown"}
                            registerForHorizontalShift={subscribeToHorizontalShift}
                            registerForVerticalShift={subscribeToVerticalShift}
                            loading={suggestionsPending}
                            options={suggestions}
                            isOpen={!suggestionsPending && shouldShowDropdown}
                            onItemSelectionChange={handleDropdownChange}
                            currentlyFocusedIndex={focusedIndex}
                            itemToHighlight={handleItemHighlighting}
                        />
                    }
                >
                    <SingleLineCodeEditor
                        mode={mode}
                        setEditorInstance={setEditorInstance}
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
