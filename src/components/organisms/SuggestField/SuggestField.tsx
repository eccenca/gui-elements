import React, { useEffect, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { IconButton } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { TextField } from "@/components/atoms/TextField";
import { TextFieldProps } from "@/components/atoms/TextField/TextField";
import { Highlighter, OverflowText } from "@/components/atoms/Typography";
import { ContextOverlayProps } from "@/components/molecules/ContextOverlay";
import { Menu, MenuItem } from "@/components/molecules/Menu";
import { Notification } from "@/components/molecules/Notification";
import {
    ComboboxDropdown,
    ComboboxItemRenderer,
    readOverlayProps,
    scrollActiveRowIntoView,
    useActiveRow,
} from "@/components/organisms/AutocompleteField/internalComboboxParts";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import { SuggestFieldItemRendererModifierProps } from "./interfaces";

type SearchFunction<T> = (value: string) => T[];
type AsyncSearchFunction<T> = (value: string) => Promise<T[]>;

/**
 * Properties for the input element of the suggest field. Structural replacement for the former
 * BlueprintJS `InputGroupProps & HTMLInputProps` type: all native input attributes plus the
 * `TextField` extras (`intent`, `leftIcon`, `rightElement`, `round`, `small`, `large`,
 * `inputRef`, ...).
 */
export type SuggestFieldInputProps = TextFieldProps;

/**
 * Parameters for the auto-complete field parameterized by T and U.
 * @param T is the input data structure/type of the items that can be selected.
 * @param UPDATE_VALUE The value type that will be pushed into the onChange callback.
 */
export interface SuggestFieldProps<T, UPDATE_VALUE> {
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
        handleClick: () => any,
    ): string | React.JSX.Element;

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
     * Props to spread to the underlying input field. To control this input, use
     * `query` and `onQueryChange` instead of `inputProps.value` and
     * `inputProps.onChange`.
     */
    inputProps?: SuggestFieldInputProps;

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
            handleClick: React.MouseEventHandler<HTMLElement>,
        ) => React.JSX.Element | undefined;

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
 * A component with the appearance of an input field that allows to select and optionally create new items.
 * It shows suggestions for the entered text from which the user can select any option.
 *
 * It has the following fixed behavior:
 *
 * - When not focused, a different representation of the item value can be shown, e.g. the label of the value.
 * - When changing an existing item the input text is set to the original value in order to be able to edit the original value.
 * - When for a specific input text, the only item returned is the currently set item itself, all items are shown below it, to make
 *   clear that there are still other items to choose from.
 * - The suggestions are fetched with a short delay, so not too many unnecessary requests are fired.
 * - Items where itemRenderer returns a string have a default representation, i.e. highlighting of search words, active flag etc.
 */
export function SuggestField<T, UPDATE_VALUE>(props: SuggestFieldProps<T, UPDATE_VALUE>) {
    const {
        className,
        reset,
        noResultText,
        disabled = false,
        onlyDropdownWithQuery = false, // FIXME: this should be `true` by default, otherwise similarity to `<Select />` is very close
        itemValueSelector,
        itemRenderer,
        onSearch,
        onChange,
        initialValue,
        autoFocus = false,
        createNewItem,
        itemValueRenderer,
        resetQueryToValue,
        itemValueString,
        requestErrorPrefix = "",
        hasBackDrop = false,
        fill = true,
        loadMoreResults,
        ...otherProps
    } = props;
    const [selectedItem, setSelectedItem] = useState<T | undefined>(initialValue);
    // If the selection list elements are currently fetched from the backend
    const [listLoading, setListLoading] = useState<boolean>(false);

    const [query, setQuery] = useState<string>("");
    // If the input field has focus
    const [inputHasFocus, setInputHasFocus] = useState<boolean>(false);
    // If the dropdown is displayed (focus received and not explicitly closed, e.g. via Escape)
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [highlightingEnabled, setHighlightingEnabled] = useState<boolean>(true);
    const [requestError, setRequestError] = useState<string | undefined>(undefined);

    // The suggestions that match the user's input
    const [filtered, setFiltered] = useState<T[]>([]);

    const readOnly = !!otherProps.inputProps?.readOnly;

    const targetRef = React.useRef<HTMLDivElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);

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
        setDropdownOpen(true);
    };

    const handleOnFocusOut = () => {
        setInputHasFocus(false);
        setDropdownOpen(false);
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
        // Suggest behavior: close on select. The focus stays inside the input because mouse
        // interactions with the dropdown content never move it (mousedown is prevented).
        setDropdownOpen(false);
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
                const emptyStringResults: T[] = await onSearch("");
                // Disable highlighting, since we used empty string search
                enableHighlighting = false;
                // Put selected item at the top if it is not in the result list
                if (!!selectedItem && itemIndexOf(emptyStringResults, selectedItem) > -1) {
                    // Do not mutate original array
                    const withoutSelected = [...emptyStringResults];
                    withoutSelected.splice(itemIndexOf(emptyStringResults, selectedItem), 1);
                    result = [selectedItem, ...withoutSelected];
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
    const optionRenderer: ComboboxItemRenderer<T> = (item, { handleClick, modifiers, query }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        const relevantModifiers: SuggestFieldItemRendererModifierProps = {
            active: modifiers.active,
            disabled: modifiers.disabled,
            highlightingEnabled: highlightingEnabled,
        };

        // `itemRenderer`'s `handleClick` prop is typed as a zero-arg callback, while the combobox
        // parts hand over a `MouseEventHandler`; the extra (optional) event argument is harmless.
        const renderedItem = itemRenderer(item, query, relevantModifiers, handleClick as () => any);
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
    const updatedInputProps: SuggestFieldInputProps = {
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
        ...otherProps.inputProps,
        title:
            selectedItem !== undefined && (readOnly || disabled)
                ? itemValueString(selectedItem)
                : otherProps.inputProps?.title,
    };
    if (selectedItem !== undefined) {
        // Makes sure that even when an empty string is selected, the placeholder won't be shown.
        updatedInputProps.placeholder = "";
    }

    const overlayProps = readOverlayProps(otherProps.contextOverlayProps);
    // Preserve the former spread semantics: a user supplied `onClosed` REPLACES the internal
    // query/list reset, a user supplied `popoverClassName` replaces the default one.
    const effectiveOverlayProps = {
        ...overlayProps,
        hasBackdrop: hasBackDrop,
        onClosed: overlayProps.onClosed ?? onPopoverClose,
    };

    // For some reason Typescript is not able to infer the union type from the ternary expression
    const createNewItemPosition: "first" | "last" = createNewItem?.showNewItemOptionFirst ? "first" : "last";

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
        [loadMoreResults],
    );

    const inputRef = React.useRef<HTMLInputElement>(null);

    // --- dropdown row model ----------------------------------------------------------------------

    // "Create new item" option: never shown when the query equals the already selected item, and
    // never when an item with the same value already exists in the result list.
    const showCreateNewItemOption =
        !!createNewItem &&
        query.length > 0 &&
        !(selectedItem && query === itemValueString(selectedItem)) &&
        !filtered.some((item) => areEqualItems(item, createNewItem.itemFromQuery(query)));

    const handleCreateNewItem = (e?: React.SyntheticEvent<HTMLElement>) => {
        if (createNewItem) {
            onSelectionChange(createNewItem.itemFromQuery(query), e);
        }
    };

    const itemRowKey = (index: number) => `item-${index}`;
    const buildRows = (activeKey: string | undefined) => {
        const rows: { key: string; element: React.JSX.Element }[] = [];
        const createElement = showCreateNewItemOption
            ? createNewItem!.itemRenderer(
                  query,
                  { active: activeKey === "create", highlightingEnabled: false },
                  (event) => {
                      handleCreateNewItem(event);
                  },
              )
            : undefined;
        if (createElement && createNewItemPosition === "first") {
            rows.push({ key: "create", element: createElement });
        }
        filtered.forEach((item, index) => {
            const element = optionRenderer(item, {
                handleClick: (event: React.SyntheticEvent<HTMLElement>) => onSelectionChange(item, event),
                modifiers: {
                    active: activeKey === itemRowKey(index),
                    disabled: false,
                    matchesPredicate: true,
                },
                query,
            });
            if (element) {
                rows.push({ key: itemRowKey(index), element });
            }
        });
        if (createElement && createNewItemPosition !== "first") {
            rows.push({ key: "create", element: createElement });
        }
        return rows;
    };

    const navRows = requestError ? [] : buildRows(undefined).map(({ key }) => ({ key }));
    const { activeKey, moveActive, resetActive } = useActiveRow(navRows);
    const rows = requestError ? [] : buildRows(activeKey);

    // The dropdown is only rendered when it has content to show (`onlyDropdownWithQuery` parity).
    const contentAvailable = !(onlyDropdownWithQuery && !query);
    // A `readOnly` input never displays the dropdown (even overriding a user supplied `isOpen`).
    const showDropdown = readOnly ? false : (overlayProps.isOpen ?? (dropdownOpen && !disabled && contentAvailable));

    // Reset the active item when the query changes.
    const previousQuery = React.useRef(query);
    React.useEffect(() => {
        if (previousQuery.current !== query) {
            previousQuery.current = query;
            resetActive();
        }
    }, [query]);

    React.useEffect(() => {
        if (showDropdown) {
            scrollActiveRowIntoView(listRef.current);
        }
    }, [activeKey, showDropdown]);

    const activateActiveRow = (event: React.SyntheticEvent<HTMLElement>): boolean => {
        if (activeKey === "create") {
            handleCreateNewItem(event);
            return true;
        }
        const index = activeKey ? parseInt(activeKey.replace("item-", ""), 10) : -1;
        if (index >= 0 && filtered[index] !== undefined) {
            onSelectionChange(filtered[index], event);
            return true;
        }
        return false;
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp":
                event.preventDefault();
                if (!showDropdown) {
                    setDropdownOpen(true);
                } else {
                    moveActive(event.key === "ArrowDown" ? 1 : -1);
                }
                break;
            case "Enter":
                if (showDropdown && !listLoading && activateActiveRow(event)) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                break;
            case "Escape":
                if (showDropdown) {
                    event.preventDefault();
                    event.stopPropagation();
                    // The dropdown shell fires `onClosed` (default: query/options reset) on close.
                    setDropdownOpen(false);
                }
                break;
            default:
                break;
        }
        updatedInputProps.onKeyDown?.(event);
    };

    // --- dropdown content --------------------------------------------------------------------------
    let listContent: React.ReactNode;
    if (listLoading) {
        listContent = <MenuItem disabled={true} text={<Spinner position={"inline"} />} />;
    } else if (requestError) {
        listContent = (
            <li>
                <Notification intent="danger" message={requestError} />
            </li>
        );
    } else if (rows.length > 0) {
        listContent = rows.map(({ key, element }) => <React.Fragment key={key}>{element}</React.Fragment>);
    } else {
        listContent = <MenuItem disabled={true} text={noResultText} />;
    }

    const { value: _ignoredValue, onChange: _ignoredOnChange, ...inputPropsRest } = updatedInputProps;

    return (
        <PopoverPrimitive.Root open={showDropdown}>
            <PopoverPrimitive.Anchor asChild>
                <div
                    ref={targetRef}
                    className={
                        `${eccgui}-suggestfield ${eccgui}-autocompletefield__input` +
                        (className ? ` ${className}` : "") +
                        (fill ? " w-full" : " inline-block")
                    }
                    onClick={(event) => {
                        // Blueprint parity: only a click on the input itself displays the dropdown
                        // (the caret button focuses the input explicitly for the same effect).
                        if (!disabled && !readOnly && event.target === inputRef.current) {
                            setDropdownOpen(true);
                        }
                    }}
                >
                    <TextField
                        {...inputPropsRest}
                        disabled={disabled}
                        fill={fill}
                        inputRef={inputRef}
                        onFocus={(event) => {
                            handleOnFocusIn();
                            otherProps.inputProps?.onFocus?.(event);
                        }}
                        onBlur={(event) => {
                            handleOnFocusOut();
                            otherProps.inputProps?.onBlur?.(event);
                        }}
                        value={
                            inputHasFocus && !readOnly && !disabled
                                ? query
                                : selectedItem !== undefined
                                  ? itemValueRenderer(selectedItem)
                                  : ""
                        }
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setDropdownOpen(true);
                        }}
                        onKeyDown={handleInputKeyDown}
                    />
                </div>
            </PopoverPrimitive.Anchor>
            <ComboboxDropdown
                open={showDropdown}
                onCloseRequest={() => setDropdownOpen(false)}
                isAnchorInteraction={(target) => !!(target instanceof Node && targetRef.current?.contains(target))}
                overlayProps={effectiveOverlayProps}
                defaultMatchTargetWidth={fill}
                defaultPopoverClassName={`${eccgui}-autocompletefield__options`}
                contentClassName="nodrag"
            >
                <Menu
                    role="listbox"
                    ulRef={listRef}
                    onScroll={handleMenuScroll}
                    className="max-h-[45vh] overflow-auto p-1"
                >
                    {listContent}
                </Menu>
            </ComboboxDropdown>
        </PopoverPrimitive.Root>
    );
}

export default SuggestField;
