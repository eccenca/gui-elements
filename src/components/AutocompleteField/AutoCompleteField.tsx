import React, {useEffect, useState, useRef} from "react";
import {HTMLInputProps, IInputGroupProps} from "@blueprintjs/core";
import {Suggest} from "@blueprintjs/select";
import {Highlighter, IconButton, Menu, MenuItem, OverflowText, Spinner} from "@gui-elements/index";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

type SearchFunction<T extends any> = (value: string) => T[];
type AsyncSearchFunction<T extends any> = (value: string) => Promise<T[]>;

/**
 * Parameters for the auto-complete field parameterized by T and U.
 * @param T is the input data structure/type of the items that can be selected.
 * @param U is the output data structure/type that is output on changes of the selected item, i.e. it may get converted first
 *          before onChange is called.
 */
export interface IAutoCompleteFieldProps<T extends any, U extends any> {
    /**
     * Fired when text is typed into the input field. Returns a list of items of type T.
     */
    onSearch: SearchFunction<T> | AsyncSearchFunction<T>;

    /**
     * Fired when value selected from input
     * @param value The value that has been converted with itemValueSelector.
     * @param e     The event
     */
    onChange?(value: U, e?: React.SyntheticEvent<HTMLElement>);

    /**
     * The initial value for the auto-complete input field
     */
    initialValue?: T;

    /**
     * Returns the UI representation of the selectable items.
     * If the return value is a string, a default render component will be displayed with search highlighting.
     *
     * @param item  The item that should be displayed as an option in the select list.
     * @param query The current search query
     * @param active If the item is currently active
     * @param handleClick The function that needs to be called when the rendered item gets clicked. Else a selection
     *                    via mouse is not possible. This only needs to be used when returning a JSX.Element.
     */
    itemRenderer(item: T, query: string, active: boolean, handleClick: () => any): string | JSX.Element;

    /** Renders the string that should be displayed in the input field after the item has been selected.
     */
    itemValueRenderer(item: T): string;

    /**
     * Selects the part from the auto-completion item that is called with the onChange callback.
     * @param item The selected item that should be converted to the value that onChange is called with.
     */
    itemValueSelector(item: T): U;

    /** The text that should be displayed when no search result has been found and no custom entry can be created. */
    noResultText: string

    /**
     * Props to spread to the underlying input field. This is BlueprintJs specific. To control this input, use
     * `query` and `onQueryChange` instead of `inputProps.value` and
     * `inputProps.onChange`.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /** Defines if a value can be reset, i.e. a reset icon is shown and the value is set to a specific value.
     *  When undefined, a value cannot be reset.
     */
    reset?: {
        /** Returns true if the currently set value can be reset, i.e. set to the resetValue. The reset icon is only
         *  shown if true is returned. */
        resettableValue(value: T): boolean;

        /** The value onChange is called with when a reset action is triggered. */
        resetValue: U;

        /** The reset button text that is shown on hovering over the reset icon. */
        resetButtonText: string
    };

    /** If enabled the auto completion component will auto focus. */
    autoFocus?: boolean;

    /** Contains methods for new item creation. If undefined no new, custom items can be created. */
    createNewItem?: {
        /** Creates a new item from the query. */
        itemFromQuery: (query: string) => T;

        /** Renders how the option to newly create an item should look like in the selection list. */
        itemRenderer: (
            query: string,
            active: boolean,
            handleClick: React.MouseEventHandler<HTMLElement>
        ) => JSX.Element | undefined;
    };

    /** If true the input field will be disabled. */
    disabled?: boolean;
}

AutoCompleteField.defaultProps = {
    autoFocus: false,
    disabled: false,
};

/** Auto-complete input widget. */
export function AutoCompleteField<T extends any, U extends any>(props: IAutoCompleteFieldProps<T, U>) {
    const {
        reset,
        noResultText,
        disabled,
        itemValueSelector,
        itemRenderer,
        onSearch,
        onChange,
        initialValue,
        autoFocus,
        createNewItem,
        itemValueRenderer,
        ...otherProps
    } = props;
    const [selectedItem, setSelectedItem] = useState<T | undefined>(initialValue);
    // If the selection list elements are currently fetched from the backend
    const [listLoading, setListLoading] = useState<boolean>(false);

    const [query, setQuery] = useState<string>("");
    const [hasFocus, setHasFocus] = useState<boolean>(false);
    const [highlightingEnabled, setHighlightingEnabled] = useState<boolean>(true);

    // The suggestions that match the user's input
    const [filtered, setFiltered] = useState<T[]>([]);

    const SuggestAutocomplete = Suggest.ofType<T>();

    // Sets the query to the item value if it has a valid string value
    const setQueryToSelectedValue = (item: T) => {
        if (item) {
            setQuery(itemValueRenderer(item));
        }
    };

    // The key for the option elements
    const itemKey = (item: T): string => {
        let itemValue: U | string = itemValueSelector(item);
        if (typeof itemValue !== "string") {
            itemValue = itemValueRenderer(item);
        }
        return itemValue;
    };

    useEffect(() => {
        setQueryToSelectedValue(selectedItem);
    }, [selectedItem]);

    useEffect(() => {
        if (!disabled && hasFocus) {
            setListLoading(true);
            const timeout: number = window.setTimeout(async () => {
                fetchQueryResults(query);
            }, 200);
            return () => {
                clearTimeout(timeout);
                setListLoading(false);
            };
        }
    }, [hasFocus, query]);

    const fieldRef = useRef(null);
    const useElementWidth = (elRef) => {
        const [width, setWidth] = useState(0);
        useEffect(() => {
            setWidth(elRef.current.offsetWidth);
        }, [elRef])
        return width ? { width: width + "px", maxWidth: "90vw" } : { width: "40rem", maxWidth: "90vw" }
    };
    const fieldWidthLimits = useElementWidth(fieldRef);

    // We need to fire some actions when the auto-complete widget gets or loses focus
    const handleOnFocusIn = () => {
        setHasFocus(true);
    };

    const handleOnFocusOut = () => {
        setHasFocus(false);
    };

    // On popover close reset query to selected item
    const onPopoverClose = () => {
        // Reset query to selected value when loosing focus, so the selected value can always be edited.
        setQueryToSelectedValue(selectedItem);
        // Reset option list when the popover closes, so next use there is not displayed a stale list
        setFiltered([]);
    }

    // Triggered when an item from the selection list gets selected
    const onSelectionChange = (value, e) => {
        setSelectedItem(value);
        onChange(itemValueSelector(value), e);
        setQueryToSelectedValue(value);
    };

    const areEqualItems = (itemA, itemB) => itemValueSelector(itemA) === itemValueSelector(itemB);

    // Return the index of the item in the array based on the itemValueRenderer value
    const itemIndexOf = (arr: T[], searchItem: T): number => {
        let idx = -1;
        const searchItemString = itemValueRenderer(searchItem);
        arr.forEach((v, i) => {
            if (itemValueRenderer(v) === searchItemString) {
                idx = i;
            }
        });
        return idx;
    };

    // Fetches the results for the given query
    const fetchQueryResults = async (input: string) => {
        setListLoading(true);
        try {
            let result = await onSearch(input);
            let enableHighlighting = true;
            if (result.length <= 1 && selectedItem && input.length > 0 && itemValueRenderer(selectedItem) === input) {
                // If the auto-completion only returns no suggestion or the selected item itself, query with empty string.
                const emptyStringResults = await onSearch("");
                // Disable highlighting, since we used empty string search
                enableHighlighting = false;
                // Put selected item at the top if it is not in the result list
                if (itemIndexOf(emptyStringResults, selectedItem) === -1) {
                    result = [selectedItem, ...emptyStringResults];
                } else {
                    result = emptyStringResults;
                }
            }
            setHighlightingEnabled(enableHighlighting);
            setFiltered(result);
        } catch (e) {
            console.log(e);
        } finally {
            setListLoading(false);
        }
    };

    // Renders the item in the selection list
    const optionRenderer = (item, { handleClick, modifiers, query }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        const renderedItem = itemRenderer(item, query, modifiers.active, handleClick);
        if (typeof renderedItem === "string") {
            return (
                <MenuItem
                    active={modifiers.active}
                    disabled={modifiers.disabled}
                    key={itemKey(item)}
                    onClick={handleClick}
                    text={
                        <OverflowText style={fieldWidthLimits}>
                            {!highlightingEnabled ? renderedItem : <Highlighter label={renderedItem} searchValue={query} />}
                        </OverflowText>
                    }
                />
            );
        } else {
            return renderedItem;
        }
    };
    // Resets the selection
    const clearSelection = (resetValue: U) => () => {
        setSelectedItem(undefined);
        onChange(resetValue);
        setQuery("");
    };
    // Optional clear button to reset the selected value
    const clearButton = reset &&
        selectedItem !== undefined &&
        selectedItem !== null &&
        reset.resettableValue(selectedItem) && (
            <IconButton
                data-test-id={
                    (otherProps.inputProps.id ? `${otherProps.inputProps.id}-` : "") + "auto-complete-clear-btn"
                }
                name="operation-clear"
                text={reset.resetButtonText}
                onClick={clearSelection(reset.resetValue)}
            />
        );
    // Additional properties for the input element of the auto-completion widget
    const updatedInputProps: IInputGroupProps & HTMLInputProps = {
        rightElement: clearButton,
        autoFocus: autoFocus,
        onBlur: handleOnFocusOut,
        onFocus: handleOnFocusIn,
        ...otherProps.inputProps,
    };
    if(selectedItem !== undefined) {
        // Makes sure that even when an empty string is selected, the placeholder won't be shown.
        updatedInputProps.placeholder = ""
    }
    return (
        <div ref={fieldRef}>
            <SuggestAutocomplete
                className={`${eccgui}-autocompletefield__input`}
                disabled={disabled}
                items={filtered}
                inputValueRenderer={selectedItem !== undefined ? itemValueRenderer : () => ""}
                itemRenderer={optionRenderer}
                itemsEqual={areEqualItems}
                noResults={<MenuItem disabled={true} text={noResultText} style={fieldWidthLimits} />}
                onItemSelect={onSelectionChange}
                onQueryChange={(q) => setQuery(q)}
                closeOnSelect={true}
                query={query}
                popoverProps={{
                    minimal: true,
                    position: "bottom",
                    popoverClassName: `${eccgui}-autocompletefield__options`,
                    wrapperTagName: "div",
                    onClosed: onPopoverClose,
                }}
                selectedItem={selectedItem}
                fill
                createNewItemFromQuery={createNewItem?.itemFromQuery}
                createNewItemRenderer={createNewItem?.itemRenderer}
                {...otherProps}
                inputProps={updatedInputProps}
                itemListRenderer={listLoading ? () => <Menu><MenuItem disabled={true} text={<Spinner position={"inline"} />} style={fieldWidthLimits} /></Menu> : undefined}
            />
        </div>
    );
}
