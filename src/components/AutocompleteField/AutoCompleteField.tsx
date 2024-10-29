import React, { useEffect, useState } from "react";
import {
    HTMLInputProps as BlueprintHTMLInputProps,
    InputGroupProps as BlueprintInputGroupProps,
} from "@blueprintjs/core";
import { Suggest as BlueprintSuggest } from "@blueprintjs/select";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {
    ContextOverlayProps,
    Highlighter,
    IconButton,
    Menu,
    MenuItem,
    Notification,
    OverflowText,
    Spinner,
} from "../../index";

import { SuggestFieldItemRendererModifierProps } from "./interfaces";

type SearchFunction<T> = (value: string) => T[];
type AsyncSearchFunction<T> = (value: string) => Promise<T[]>;

/**
 * @deprecated (v25) replaced by SuggestFieldProps
 */
export interface AutoCompleteFieldProps<T, UPDATE_VALUE> {
    /**
     * Additional class names.
     */
    className?: string;
    /**
     * Fired when text is typed into the input field. Returns a list of items of type T.
     */
    onSearch: SearchFunction<T> | AsyncSearchFunction<T>;

    /**
     * Fired when value selected from input
     * @param value The value that has been converted with itemValueSelector.
     * @param e     The event
     */
    onChange?(value: UPDATE_VALUE, e?: React.SyntheticEvent<HTMLElement>): any;

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
     * @param modifiers Modifiers for rendered elements, e.g. active, disabled.
     * @param handleClick The function that needs to be called when the rendered item gets clicked. Else a selection
     *                    via mouse is not possible. This only needs to be used when returning a JSX.Element.
     */
    itemRenderer(
        item: T,
        query: string,
        modifiers: SuggestFieldItemRendererModifierProps,
        handleClick: () => any
    ): string | JSX.Element;

    /** Renders the string that should be displayed in the input field after the item has been selected.
     */
    itemValueRenderer(item: T): string;

    /**
     * Selects the part from the auto-completion item that is called with the onChange callback.
     * @param item The selected item that should be converted to the value that onChange is called with.
     */
    itemValueSelector(item: T): UPDATE_VALUE;

    /** The string representation of the actual value, i.e. without meta data etc. This will be used to compare if values are equal. */
    itemValueString(item: T): string;

    /** The text that should be displayed when no search result has been found and no custom entry can be created. */
    noResultText: string;

    /**
     * Props to spread to the underlying input field. This is BlueprintJs specific. To control this input, use
     * `query` and `onQueryChange` instead of `inputProps.value` and
     * `inputProps.onChange`.
     */
    inputProps?: BlueprintInputGroupProps & BlueprintHTMLInputProps;

    /**
     * Optional props of the internally used `<ContextOverlay/>` element..
     */
    contextOverlayProps?: Partial<Omit<ContextOverlayProps, "content" | "children">>;

    /** Defines if a value can be reset, i.e. a reset icon is shown and the value is set to a specific value.
     *  When undefined, a value cannot be reset.
     */
    reset?: {
        /** Returns true if the currently set value can be reset, i.e. set to the resetValue. The reset icon is only
         *  shown if true is returned. */
        resettableValue(value: T): boolean;

        /** The value onChange is called with when a reset action is triggered. */
        resetValue: UPDATE_VALUE;

        /** The reset button text that is shown on hovering over the reset icon. */
        resetButtonText: string;
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
            modifiers: SuggestFieldItemRendererModifierProps,
            handleClick: React.MouseEventHandler<HTMLElement>
        ) => JSX.Element | undefined;

        /** If the new item option will always be shown as the first entry in the suggestion list, else it will be the last entry.
         * @default false
         */
        showNewItemOptionFirst?: boolean;
    };

    /** Dropdown is only rendered when the query has a value (input field is not empty). */
    onlyDropdownWithQuery?: boolean;

    /** If true the input field will be disabled. */
    disabled?: boolean;

    /** The value to which the search query should be reset after the popover closes.
     *  By default the query is reset to the result of itemValueRenderer(selectedValue).
     *
     * @param selectedValue The currently selected value.
     */
    resetQueryToValue?(selectedValue: T): string;

    /** If an error occurs during the auto-completion request, the error details will be prefixed with this string. */
    requestErrorPrefix?: string;

    /** Creates a backdrop when the popover is shown that captures outside clicks in order to close the popover.
     * This is needed if other components on the same page are swallowing events, e.g. the react-flow canvas.
     * hasBackDrop should then be set to true in these cases otherwise the popover won't close when clicking those other components.
     **/
    hasBackDrop?: boolean;

    /**
     * Use the full available width of the parent container.
     */
    fill?: boolean;
    /** Utility that fetches more options when clicked*/
    loadMoreResults?: () => Promise<T[] | undefined>;
}

/**
 * @deprecated (v25) replaced by SuggestFieldProps
 */
export type IAutoCompleteFieldProps<T, UPDATE_VALUE> = AutoCompleteFieldProps<T, UPDATE_VALUE>;

AutoCompleteField.defaultProps = {
    autoFocus: false,
    disabled: false,
    onlyDropdownWithQuery: false, // FIXME: this should be `true` by default, otherwise similarity to `<Select />` is very close
    fill: true,
    requestErrorPrefix: "",
    hasBackDrop: false,
};

/**
 * @deprecated (support already removed) use `SuggestField` as replacement.
 */
function AutoCompleteField<T, UPDATE_VALUE>(props: AutoCompleteFieldProps<T, UPDATE_VALUE>) {
    const {
        className,
        reset,
        noResultText,
        disabled,
        onlyDropdownWithQuery,
        itemValueSelector,
        itemRenderer,
        onSearch,
        onChange,
        initialValue,
        autoFocus,
        createNewItem,
        itemValueRenderer,
        resetQueryToValue,
        itemValueString,
        requestErrorPrefix,
        hasBackDrop,
        fill,
        loadMoreResults,
        ...otherProps
    } = props;
    const [selectedItem, setSelectedItem] = useState<T | undefined>(initialValue);
    // If the selection list elements are currently fetched from the backend
    const [listLoading, setListLoading] = useState<boolean>(false);

    const [query, setQuery] = useState<string>("");
    // If the input field has focus
    const [inputHasFocus, setInputHasFocus] = useState<boolean>(false);
    const [highlightingEnabled, setHighlightingEnabled] = useState<boolean>(true);
    const [requestError, setRequestError] = useState<string | undefined>(undefined);

    // The suggestions that match the user's input
    const [filtered, setFiltered] = useState<T[]>([]);

    const readOnly = !!otherProps.inputProps?.readOnly;

    // Sets the query to the item value if it has a valid string value
    const setQueryToSelectedValue = (item?: T) => {
        if (item) {
            // If new values can be created, always reset the query value to the actual value of the selected item.
            // This e.g. prevents that the "create new" option will be shown, since an item with the same value already exists.
            const defaultResetValue: string = createNewItem
                ? (itemValueString(item) as string)
                : itemValueRenderer(item);
            const resetVal = resetQueryToValue ? resetQueryToValue(item) : defaultResetValue;
            setQuery(resetVal);
        }
    };

    // The key for the option elements
    const itemKey = (item: T): string => {
        return itemValueString(item);
    };

    useEffect(() => {
        setQueryToSelectedValue(selectedItem);
    }, [selectedItem]);

    useEffect(() => {
        if (!disabled && !readOnly && inputHasFocus) {
            setListLoading(true);
            const timeout: number = window.setTimeout(async () => {
                fetchQueryResults(query);
            }, 200);
            return () => {
                clearTimeout(timeout);
                setListLoading(false);
            };
        }
        return;
    }, [inputHasFocus, query]);

    // We need to fire some actions when the auto-complete widget gets or loses focus
    const handleOnFocusIn = () => {
        setInputHasFocus(true);
    };

    const handleOnFocusOut = () => {
        setInputHasFocus(false);
    };

    // On popover close reset query to selected item
    const onPopoverClose = () => {
        // Reset query to selected value when loosing focus, so the selected value can always be edited.
        setQueryToSelectedValue(selectedItem);
        // Reset option list when the popover closes, so next use there is not displayed a stale list
        setFiltered([]);
    };

    // Triggered when an item from the selection list gets selected
    const onSelectionChange = (value: any, e: any) => {
        setSelectedItem(value);
        onChange?.(itemValueSelector(value), e);
        setQueryToSelectedValue(value);
    };

    const areEqualItems = (itemA: any, itemB: any) => itemValueSelector(itemA) === itemValueSelector(itemB);

    // Return the index of the item in the array based on the itemValueRenderer value
    const itemIndexOf = (arr: T[], searchItem: T): number => {
        let idx = -1;
        const searchItemString = itemValueString(searchItem);
        arr.forEach((v, i) => {
            if (itemValueString(v) === searchItemString) {
                idx = i;
            }
        });
        return idx;
    };

    // Fetches the results for the given query
    const fetchQueryResults = async (input: string) => {
        setListLoading(true);
        setRequestError(undefined);
        try {
            let result = await onSearch(input);
            const onlySelectItemReturned =
                result.length <= 1 &&
                selectedItem &&
                input.length > 0 &&
                (itemValueRenderer(selectedItem) === input || itemValueString(selectedItem) === input);
            let enableHighlighting = true;
            if (onlySelectItemReturned) {
                // If the auto-completion only returns no suggestion or the selected item itself, query with empty string.
                const emptyStringResults = await onSearch("");
                // Disable highlighting, since we used empty string search
                enableHighlighting = false;
                // Put selected item at the top if it is not in the result list
                if (!!selectedItem && itemIndexOf(emptyStringResults, selectedItem) > -1) {
                    emptyStringResults.splice(itemIndexOf(emptyStringResults, selectedItem), 1);
                    result = [selectedItem, ...emptyStringResults];
                } else {
                    result = emptyStringResults;
                }
            }
            setHighlightingEnabled(enableHighlighting);
            setFiltered(result);
        } catch (e: any) {
            const details = e?.message ?? "";
            setRequestError(requestErrorPrefix + details);
        } finally {
            setListLoading(false);
        }
    };

    // Renders the item in the selection list
    const optionRenderer = (
        item: any,
        { handleClick, modifiers, query }: { handleClick: any; modifiers: any; query: any }
    ) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        const relevantModifiers: SuggestFieldItemRendererModifierProps = {
            active: modifiers.active,
            disabled: modifiers.disabled,
            highlightingEnabled: highlightingEnabled,
        };

        const renderedItem = itemRenderer(item, query, relevantModifiers, handleClick);
        if (typeof renderedItem === "string") {
            return (
                <MenuItem
                    active={modifiers.active}
                    disabled={modifiers.disabled}
                    key={itemKey(item)}
                    onClick={handleClick}
                    text={
                        <OverflowText>
                            {!highlightingEnabled ? (
                                renderedItem
                            ) : (
                                <Highlighter label={renderedItem} searchValue={query} />
                            )}
                        </OverflowText>
                    }
                />
            );
        } else {
            return renderedItem;
        }
    };
    // Resets the selection
    const clearSelection = (resetValue: UPDATE_VALUE) => () => {
        setSelectedItem(undefined);
        onChange?.(resetValue);
        setQuery("");
    };
    const requestErrorRenderer = () => {
        return <Notification danger={true} message={requestError} />;
    };
    // Optional clear button to reset the selected value
    const clearButton =
        !readOnly && !disabled && reset && selectedItem != null && reset.resettableValue(selectedItem) ? (
            <IconButton
                data-test-id={
                    (otherProps.inputProps?.id ? `${otherProps.inputProps.id}-` : "") + "auto-complete-clear-btn"
                }
                name="operation-clear"
                text={reset.resetButtonText}
                onClick={clearSelection(reset.resetValue)}
            />
        ) : undefined;
    // Additional properties for the input element of the auto-completion widget
    const updatedInputProps: BlueprintInputGroupProps & BlueprintHTMLInputProps = {
        rightElement:
            clearButton || onlyDropdownWithQuery === false ? (
                <>
                    {clearButton}
                    {onlyDropdownWithQuery === false && (
                        <IconButton
                            name={"toggler-caretdown"}
                            onClick={(e: React.MouseEvent<HTMLElement>) => {
                                const target = e.currentTarget
                                    .closest(`.${eccgui}-autocompletefield__input`)
                                    ?.querySelector("input");
                                (target as HTMLElement).focus();
                                e.stopPropagation();
                            }}
                        />
                    )}
                </>
            ) : undefined,
        autoFocus: autoFocus,
        onBlur: handleOnFocusOut,
        onFocus: handleOnFocusIn,
        ...otherProps.inputProps,
        title:
            selectedItem !== undefined && (readOnly || disabled)
                ? itemValueString(selectedItem)
                : otherProps.inputProps?.title,
    };
    const preventOverlayOnReadonly = readOnly ? { isOpen: false } : {};
    const updatedContextOverlayProps: Partial<Omit<ContextOverlayProps, "content" | "children">> = {
        minimal: true,
        matchTargetWidth: fill,
        popoverClassName: `${eccgui}-autocompletefield__options`,
        onClosed: onPopoverClose,
        ...otherProps.contextOverlayProps,
        ...preventOverlayOnReadonly,
        // Needed to capture clicks outside of the popover, e.g. in order to close it.
        hasBackdrop: hasBackDrop,
    };
    if (selectedItem !== undefined) {
        // Makes sure that even when an empty string is selected, the placeholder won't be shown.
        updatedInputProps.placeholder = "";
    }
    // For some reason Typescript is not able to infer the union type from the ternary expression
    const createNewItemPosition: "first" | "last" = createNewItem?.showNewItemOptionFirst ? "first" : "last";
    const createNewItemProps = createNewItem
        ? {
              createNewItemFromQuery: createNewItem.itemFromQuery,
              createNewItemRenderer: (
                  query: string,
                  active: boolean,
                  handleClick: React.MouseEventHandler<HTMLElement>
              ) => {
                  if (selectedItem && query === itemValueString(selectedItem)) {
                      // Never show create new item option if the same item is already selected
                      return undefined;
                  } else {
                      return createNewItem!.itemRenderer(query, { active, highlightingEnabled: false }, handleClick);
                  }
              },
              createNewItemPosition,
          }
        : {};

    const handleMenuScroll = React.useCallback(
        async (event: any) => {
            const menu = event.target;
            const { scrollTop, scrollHeight, clientHeight } = menu;
            // Check if scrolled to the bottom of the list
            if (Math.round(scrollTop + clientHeight) >= scrollHeight && loadMoreResults) {
                const results = await loadMoreResults();
                if (results) {
                    setFiltered((prev) => [...prev, ...results]);
                    setTimeout(() => {
                        menu.scrollTop = scrollTop; //safari adaptation
                        menu.scrollTo({ left: 0, top: scrollTop, behavior: "auto" });
                    });
                }
            }
        },
        [loadMoreResults]
    );

    return (
        <BlueprintSuggest<T>
            className={`${eccgui}-autocompletefield__input` + (className ? ` ${className}` : "")}
            disabled={disabled}
            // Need to display error messages in list
            items={requestError ? [requestError as unknown as T] : filtered}
            initialContent={onlyDropdownWithQuery ? null : undefined}
            inputValueRenderer={selectedItem !== undefined ? itemValueRenderer : () => ""}
            itemRenderer={requestError ? requestErrorRenderer : optionRenderer}
            itemsEqual={areEqualItems}
            noResults={<MenuItem disabled={true} text={noResultText} />}
            onItemSelect={onSelectionChange}
            onQueryChange={(q) => setQuery(q)}
            resetOnQuery={false}
            closeOnSelect={true}
            menuProps={{
                onScroll: handleMenuScroll,
            }}
            query={query}
            // This leads to odd compile errors without "as any"
            popoverProps={updatedContextOverlayProps as any}
            selectedItem={selectedItem}
            fill={fill}
            {...createNewItemProps}
            // This leads to odd compile errors without "as any"
            inputProps={updatedInputProps as any}
            itemListRenderer={
                listLoading
                    ? () => (
                          <Menu>
                              <MenuItem disabled={true} text={<Spinner position={"inline"} />} />
                          </Menu>
                      )
                    : undefined
            }
        />
    );
}

export default AutoCompleteField;
