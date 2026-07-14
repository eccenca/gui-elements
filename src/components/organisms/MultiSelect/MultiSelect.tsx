import React, { useRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { BasicIntentTypes, intentClassName, IntentTypes } from "@/common/Intent";
import { cn } from "@/common/utils/cn";
import { removeExtraSpaces } from "@/common/utils/stringUtils";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import Tag from "@/components/atoms/Tag/Tag";
import { TestableComponent } from "@/components/interfaces";

import {
    ComboboxDropdown,
    ComboboxItemRenderer,
    ComboboxCreateNewItemRenderer,
    readOverlayProps,
    scrollActiveRowIntoView,
    useActiveRow,
} from "@/components/organisms/AutocompleteField/internalComboboxParts";

import {
    ContextOverlayProps,
    Highlighter,
    highlighterUtils,
    IconButton,
    Menu,
    MenuItem,
    OverflowText,
    Spinner,
} from "@/index";

export interface MultiSuggestFieldSelectionProps<T> {
    newlySelected?: T;
    newlyRemoved?: T;
    selectedItems: T[];
    createdItems: Partial<T>[];
}

/**
 * Properties for the tag input target of the multi suggest field. Structural replacement for the
 * former BlueprintJS `Partial<TagInputProps>` type (property names kept identical).
 */
export interface MultiSuggestFieldTagInputProps {
    /** Whether the entered text should be added as tag when the input loses focus (currently without effect). */
    addOnBlur?: boolean;
    /** Kept for compatibility (currently without effect). */
    addOnPaste?: boolean;
    /** Kept for compatibility (currently without effect). */
    autoResize?: boolean;
    /** Additional class name for the tag input element. Replaces the default class names. */
    className?: string;
    /** Disables the tag input. */
    disabled?: boolean;
    /** Use the full width of the parent container. */
    fill?: boolean;
    /** Props to pass to the (query) input element. Replaces the default input props. */
    inputProps?: React.InputHTMLAttributes<HTMLInputElement> & { [key: `data-${string}`]: string | undefined };
    /** Ref handler for the query input element. */
    inputRef?: React.Ref<HTMLInputElement>;
    /** Controlled input value (kept for compatibility, currently without effect). */
    inputValue?: string;
    /** Intent state of the tag input. */
    intent?: BasicIntentTypes;
    /** Kept for compatibility (currently without effect). */
    large?: boolean;
    /** Element displayed on the left side of the tag input. */
    leftIcon?: React.ReactNode;
    /** Kept for compatibility (currently without effect). */
    onAdd?: (values: string[], method: unknown) => boolean | void;
    /** Kept for compatibility (currently without effect). */
    onChange?: (values: React.ReactNode[]) => boolean | void;
    /** Kept for compatibility (currently without effect). */
    onInputChange?: React.FormEventHandler<HTMLInputElement>;
    /** Key down handler for the query input. Replaces the internal (tab selection) handler. */
    onKeyDown?: (event: React.KeyboardEvent<HTMLElement>, index?: number) => void;
    /** Key up handler for the query input. Replaces the internal (enter creation) handler. */
    onKeyUp?: (event: React.KeyboardEvent<HTMLElement>, index?: number) => void;
    /** Handler for removing a tag. Replaces the internal handler. */
    onRemove?: (value: React.ReactNode, index: number) => void;
    /** Placeholder text displayed when no tags are selected. */
    placeholder?: string;
    /** Element displayed on the right side of the tag input. Replaces the default (clearance/dropdown caret) elements. */
    rightElement?: React.JSX.Element;
    /** Kept for compatibility (currently without effect). */
    separator?: string | RegExp | false;
    /**
     * Props (object or function returning an object per tag) that are spread to the rendered
     * `Tag` elements, e.g. `intent`, `icon`, `htmlTitle`, `minimal`.
     */
    tagProps?: Record<string, any> | ((value: React.ReactNode, index: number) => Record<string, any>);
    /** Controlled tag values (kept for compatibility, currently without effect). */
    values?: readonly React.ReactNode[];
}

export interface MultiSuggestFieldCommonProps<T> extends TestableComponent {
    /** The list of (unfiltered) items. */
    items: T[];
    /**
     * Input placeholder text, displayed when no items are selected.
     * Shorthand for `tagInputProps.placeholder`.
     */
    placeholder?: string;
    /**
     * If `true`, the component waits until a keyboard interaction with the input before displaying
     * the dropdown, otherwise it is already displayed when the element is clicked.
     */
    openOnKeyDown?: boolean;
    /** Content displayed when the query does not match any option. */
    noResults?: React.ReactNode;
    /** Renders the "create new item from query" option. Return `undefined` to not display it. */
    createNewItemRenderer?: ComboboxCreateNewItemRenderer;
    /** Renders a single option of the dropdown list. */
    itemRenderer?: ComboboxItemRenderer<T>;
    /**
     * Additional class name, space separated.
     */
    className?: string;
    /**
     * Returns the unique ID of an item. This will be used for equality of items.
     */
    itemId: (item: T) => string;
    /**
     * Returns the label of an item.
     * this would be used in the item selection list as well as the multi-select input
     */
    itemLabel: (item: T) => string;
    /**
     *  function handler that would be called anytime an item is selected/deselected or an item is created/removed
     */
    onSelection?: (params: MultiSuggestFieldSelectionProps<T>) => void;
    /**
     * Props to spread to `ContextOverlay`. Note that `content` cannot be changed.
     */
    contextOverlayProps?: Partial<Omit<ContextOverlayProps, "content" | "children">>;
    /**
     * Props to spread to `TagInput`. Use `query` and `onQueryChange` to control the input.
     */
    tagInputProps?: MultiSuggestFieldTagInputProps;

    /** Additional properties for the (query) input field of the multi-selection. */
    inputProps?: React.InputHTMLAttributes<HTMLInputElement> & { [key: `data-${string}`]: string | undefined };

    /**
     * prop to listen for query changes, when text is entered in the multi-select input
     */
    runOnQueryChange?: (query: string) => Promise<T[] | undefined> | (T[] | undefined);
    /**
     * Whether the component should take up the full width of its container.
     * This overrides `tagInputProps.fill`.
     */
    fullWidth?: boolean;
    /**
     * text content to render when filtering items returns zero results.
     * If omitted, "No results." will be rendered in this case.
     */
    noResultText?: string;
    /**
     * text content to render when a new item non-existing in filtered items is about to be created .
     * If omitted, "No results." will be rendered in this case.
     */
    newItemCreationText?: string;
    /**
     * Allows to create new item from a given query. If this is not provided then no new items can be created.
     */
    createNewItemFromQuery?: (query: string) => T;
    /** Validates if a new item can be created from the current query string. */
    isValidNewOption?: (query: string) => boolean;
    /**
     * Items that were newly created and not taken from the list will be post-fixed with this string.
     */
    newItemPostfix?: string;
    /**
     * Intent state of the multi select.
     */
    intent?: BasicIntentTypes;
    /**
     * Disables the input element
     */
    disabled?: boolean;

    /**
     * Delay in ms how long the request for the given query should be delayed.
     */
    requestDelay?: number;

    /**
     * Clear query when an option is selected or unselected.
     * The query is empty then and the user need to enter a new query.
     */
    clearQueryOnSelection?: boolean;
    /**
     * If set then a `div` element is used as wrapper.
     * It uses the attributes given via this property.
     */
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    /**
     * Function that allows us to filter values from the option list.
     *
     * @deprecated (v27) use `searchListPredicate` instead.
     */
    searchPredicate?: (item: T, query: string) => boolean;

    /**
     * Returns the filtered the search option list.
     * By default, a case-insensitive multi-word filtering is applied.
     *
     * @param items The options.
     * @param query The search query.
     */
    searchListPredicate?: (items: T[], query: string) => T[];

    /**
     * Limits the height of the input target plus its dropdown menu when it is opened.
     * Need to be a `number not greater than 100` (as `vh`, a unit describing a length relative to the viewport height) or `true` (equals 100).
     * If not set than the dropdown menu cannot be larger that appr. the half of the available viewport hight.
     */
    limitHeightOpened?: boolean | number;
}

export type MultiSuggestFieldProps<T> = MultiSuggestFieldCommonProps<T> &
    (
        | {
              /**
               * Predefined selected values.
               * `prePopulateWithItems` cannot be used then.
               */
              selectedItems?: T[];
              prePopulateWithItems?: never;
          }
        | {
              selectedItems?: never;
              /**
               * When set to `true` will set the multi-select value with all the items provided.
               * `selectedItems` cannot be used then.
               */
              prePopulateWithItems?: boolean;
          }
    );

/**
 * Element behaves very similar to `SuggestField` but allows multiple selections.
 * Its value does not represent a string but a stack of objects.
 *
 * Example usage: input field for user created tags.
 *
 * Attention: there may be another `MultiSelect` component in future but this will be a re-implemented `Select` like element allowing multiple selections.
 */
export function MultiSuggestField<T>({
    items,
    selectedItems: externalSelectedItems,
    prePopulateWithItems,
    itemId,
    itemLabel,
    onSelection,
    contextOverlayProps,
    tagInputProps,
    inputProps,
    runOnQueryChange,
    fullWidth = true,
    noResultText = "No results.",
    newItemCreationText = "Add new item",
    newItemPostfix = " (new item)",
    disabled,
    createNewItemFromQuery,
    isValidNewOption,
    requestDelay = 0,
    clearQueryOnSelection = false,
    className,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    wrapperProps,
    searchPredicate,
    searchListPredicate,
    limitHeightOpened,
    intent,
    placeholder,
    openOnKeyDown,
    noResults,
    createNewItemRenderer,
    itemRenderer,
}: MultiSuggestFieldProps<T>) {
    type SelectionChange = { type: "selected"; item: T } | { type: "removed"; item: T } | { type: "none" };

    // Options created by a user
    const createdItems = useRef<T[]>([]);
    // Options passed outside (f.e. from the backend)
    const [externalItems, setExternalItems] = React.useState<T[]>([...items]);
    // All options (created and passed) that match the query
    const [filteredItems, setFilteredItems] = React.useState<T[]>([]);
    // All options (created and passed) selected by a user
    const [selectedItems, setSelectedItems] = React.useState<T[]>(() =>
        prePopulateWithItems ? [...items] : externalSelectedItems ? [...externalSelectedItems] : [],
    );
    // Max height of the menu
    const [calculatedMaxHeight, setCalculatedMaxHeight] = React.useState<string | null>(null);
    // Whether the dropdown is displayed
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    // The current query (displayed in the input element)
    const [inputQuery, setInputQuery] = React.useState("");

    // The active popover item is only needed for keyboard interaction and should not trigger rerenders.
    const focusedItemRef = React.useRef<T | null>(null);
    const [showSpinner, setShowSpinner] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const targetRef = React.useRef<HTMLDivElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);
    const requestState = useRef<{
        query?: string;
        timeoutId?: number;
    }>({});
    const selectionChange = useRef<SelectionChange>({ type: "none" });

    const isDisabled = tagInputProps?.disabled ?? disabled;

    /** Update external items when they change
     *  e.g for auto-complete when query change
     */
    React.useEffect(() => {
        setExternalItems(items);
        setFilteredItems([...items, ...createdItems.current]);
    }, [items.map((item) => itemId(item)).join("|")]);

    React.useEffect(() => {
        const selectionParams: MultiSuggestFieldSelectionProps<T> = {
            createdItems: createdItems.current,
            selectedItems,
        };

        if (selectionChange.current.type === "selected") {
            selectionParams.newlySelected = selectionChange.current.item;
        }

        if (selectionChange.current.type === "removed") {
            selectionParams.newlyRemoved = selectionChange.current.item;
        }

        onSelection?.(selectionParams);
        selectionChange.current = { type: "none" };
    }, [
        onSelection,
        selectedItems.map((item) => itemId(item)).join("|"),
        createdItems.current.map((item) => itemId(item)).join("|"),
    ]);

    /**
     * Update selected items if we get new selected items from outside
     */
    React.useEffect(() => {
        if (!externalSelectedItems) {
            return;
        }

        selectionChange.current = { type: "none" };
        setSelectedItems(externalSelectedItems);
    }, [externalSelectedItems?.map((item) => itemId(item)).join("|")]);

    React.useEffect(() => {
        const calculateMaxHeight = () => {
            if (inputRef.current) {
                // Get the height of the input target
                const inputTargetHeight = inputRef.current.getBoundingClientRect().height;
                // Calculate the menu dropdown by using the limited height reduced by the target height
                setCalculatedMaxHeight(`calc(${maxHeightToProcess}vh - ${inputTargetHeight}px)`);
            }
        };

        const removeListener = () => {
            window.removeEventListener("resize", calculateMaxHeight);
        };

        if (!limitHeightOpened || (typeof limitHeightOpened === "number" && limitHeightOpened > 100))
            return removeListener;
        const maxHeightToProcess = typeof limitHeightOpened === "number" ? limitHeightOpened : 100;

        calculateMaxHeight();
        window.addEventListener("resize", calculateMaxHeight);
        return removeListener;
    }, [limitHeightOpened, selectedItems]);

    /**
     * using the equality prop specified checks if an item has already been selected
     * @param matcher
     * @returns
     */
    const itemHasBeenSelectedAlready = (matcher: string) => {
        return !!selectedItems.find((item) => itemId(item) === matcher);
    };

    /**
     * removes already selected item from the selectedItems
     * @param matcher
     */
    const removeItemSelection = (matcher: string) => {
        setSelectedItems((items) => {
            const removedItem = items.find((item) => itemId(item) === matcher);

            selectionChange.current = removedItem ? { type: "removed", item: removedItem } : { type: "none" };

            return items.filter((item) => itemId(item) !== matcher);
        });
    };

    /** Does a case-insensitive multi-word search in the item label. */
    const defaultSearchListPredicate = (items: T[], query: string): T[] => {
        const searchWords = highlighterUtils.extractSearchWords(query, true);
        return items.filter((item) => {
            const searchIn = itemLabel(item).toLowerCase();
            return highlighterUtils.matchesAllWords(searchIn, searchWords);
        });
    };

    /**
     * selects and deselects an item from selection list
     * if the item exists it removes it instead
     * @param item
     */
    const onItemSelect = (item: T) => {
        if (itemHasBeenSelectedAlready(itemId(item))) {
            removeItemSelection(itemId(item));
        } else {
            selectionChange.current = { type: "selected", item };
            setSelectedItems((items) => [...items, item]);
        }

        if (clearQueryOnSelection) {
            requestState.current.query = "";
            setInputQuery("");
            inputRef.current?.focus();
        } else {
            inputRef.current?.select();
        }
    };

    /**
     * search through item list using "label prop" and update the items popover
     * @param query
     */
    const onQueryChange = (query: string) => {
        if (query.length && query !== requestState.current.query) {
            requestState.current.query = query;
            if (requestState.current.timeoutId) {
                clearTimeout(requestState.current.timeoutId);
            }
            setShowSpinner(true);
            setFilteredItems([]);
            const fn = async () => {
                const resultFromQuery = runOnQueryChange && (await runOnQueryChange(removeExtraSpaces(query)));
                if (requestState.current.query === query) {
                    // Only use most recent request
                    const outsideOptions = [...(resultFromQuery ?? externalItems)];
                    let itemFilter = defaultSearchListPredicate;
                    if (searchListPredicate) {
                        itemFilter = searchListPredicate;
                    } else if (searchPredicate) {
                        itemFilter = (items, query) => {
                            return items.filter((item) => searchPredicate(item, query));
                        };
                    }

                    setFilteredItems(itemFilter([...outsideOptions, ...createdItems.current], query));
                    setShowSpinner(false);
                }
            };
            requestState.current.timeoutId = window.setTimeout(fn, requestDelay && requestDelay > 0 ? requestDelay : 0);
        } else if (!query.length) {
            // if the query is empty we need to show all options and reset current query
            requestState.current.query = "";
            setFilteredItems(() => [...externalItems, ...createdItems.current]);
        }
    };

    // Renders the entries of the (search) options list
    const optionRenderer = (label: string) => {
        return <Highlighter label={label} searchValue={requestState.current.query} />;
    };

    /**
     * defines how an item in the item list is displayed
     */
    const onItemRenderer: ComboboxItemRenderer<T> = (item, { handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        let label = itemLabel(item);
        if (createdItems.current.find((created) => itemId(created) === itemId(item))) {
            label += newItemPostfix;
        }
        return (
            <MenuItem
                active={modifiers.active}
                key={itemId(item)}
                icon={itemHasBeenSelectedAlready(itemId(item)) ? "state-checked" : "state-unchecked"}
                onClick={handleClick}
                text={optionRenderer(label)}
                shouldDismissPopover={false}
            />
        );
    };

    /**
     * clear all selected items in the multi-select input
     */
    const handleClear = () => {
        requestState.current.query = "";
        setInputQuery("");

        selectionChange.current = { type: "none" };
        setSelectedItems([]);
        setFilteredItems([...externalItems, ...createdItems.current]);
    };

    /**
     * remove a specific item from the multi-select input
     * @param label
     * @param index
     */
    const removeTagFromSelectionViaIndex = (_label: React.ReactNode, index: number) => {
        setSelectedItems((items) => {
            const removedItem = items[index];

            selectionChange.current = removedItem ? { type: "removed", item: removedItem } : { type: "none" };

            return [...items.slice(0, index), ...items.slice(index + 1)];
        });
    };

    /**
     * Utility function to create a new Item. createNewItemFromQuery is assumed to be defined!
     */
    const createNewItem = (query: string): T => {
        const newItem = createNewItemFromQuery!(query);
        //set new items
        createdItems.current = [...createdItems.current, newItem];
        setFilteredItems((items) => [...items, newItem]);
        requestState.current.query = "";
        setInputQuery("");
        return newItem;
    };

    /**
     * added functionality to create new item when there are no matching items on enter keypress
     * @param event
     */
    const handleOnKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" && !filteredItems.length && !!requestState.current.query && createNewItemFromQuery) {
            if (!isValidNewOption || isValidNewOption(requestState.current.query)) {
                createNewItem(requestState.current.query);
            }
        }
        inputRef.current?.focus();
    };

    /**
     * added functionality to either create new item
     * when there are no matching items or select an item on tab keypress
     * @param event
     */
    const handleOnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Tab" && !!requestState.current.query) {
            event.preventDefault();
            if (focusedItemRef.current) {
                onItemSelect(focusedItemRef.current);
            } else {
                if (!isValidNewOption || isValidNewOption(requestState.current.query)) {
                    onItemSelect(createNewItem(requestState.current.query));
                } else {
                    return;
                }
            }
            requestState.current.query = "";
            setInputQuery("");
            setTimeout(() => inputRef.current?.focus());
        }
    };

    /**
     * create new item handler, displays the new item selector and creates a new item when selected
     * @param label '
     * @param active
     * @param handleClick
     * @returns
     */
    const newItemRenderer = (label: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => {
        if (!createNewItemFromQuery || (isValidNewOption && !isValidNewOption(label))) return undefined;
        return (
            <MenuItem
                id={"new-item"}
                icon="item-add-artefact"
                active={active}
                key={label}
                onClick={handleClick}
                text={<OverflowText>{`${newItemCreationText} '${label}'`}</OverflowText>}
            />
        );
    };

    // Clear button and spinner are both shown as "right element"
    const clearButton =
        selectedItems.length > 0 ? (
            <IconButton
                disabled={isDisabled}
                name="operation-clear"
                data-test-id={dataTestId ? dataTestId + "_clearance" : undefined}
                data-testid={dataTestid ? dataTestid + "_clearance" : undefined}
                onClick={handleClear}
            />
        ) : undefined;

    // --- dropdown row model ------------------------------------------------------------------

    const effectiveItemRenderer = itemRenderer ?? onItemRenderer;

    // "Create new item" option, only when the query does not exactly match an existing option.
    const createdCandidate = createNewItemFromQuery && inputQuery ? createNewItemFromQuery(inputQuery) : undefined;
    const showCreateRow =
        createdCandidate !== undefined &&
        !filteredItems.some((item) => itemId(item) === itemId(createdCandidate as T));

    /** Creates the new item from the current query and selects it (mouse and keyboard path). */
    const activateCreateRow = () => {
        if (!createNewItemFromQuery || !requestState.current.query) {
            return;
        }
        if (isValidNewOption && !isValidNewOption(requestState.current.query)) {
            return;
        }
        onItemSelect(createNewItem(requestState.current.query));
    };

    const itemRowKey = (index: number) => `item-${index}`;
    const buildRows = (activeKey: string | undefined) => {
        const rows: { key: string; element: React.JSX.Element }[] = [];
        filteredItems.forEach((item, index) => {
            const element = effectiveItemRenderer(item, {
                handleClick: () => onItemSelect(item),
                handleFocus: () => {},
                index,
                modifiers: {
                    active: activeKey === itemRowKey(index),
                    disabled: false,
                    matchesPredicate: true,
                },
                query: requestState.current.query ?? "",
            });
            if (element) {
                rows.push({ key: itemRowKey(index), element });
            }
        });
        if (showCreateRow) {
            const createElement = (createNewItemRenderer ?? newItemRenderer)(inputQuery, activeKey === "create", () =>
                activateCreateRow(),
            );
            if (createElement) {
                rows.push({ key: "create", element: createElement });
            }
        }
        return rows;
    };

    const navRows = buildRows(undefined).map(({ key }) => ({ key }));
    const { activeKey, moveActive, resetActive } = useActiveRow(navRows);
    const rows = buildRows(activeKey);

    // Keep the (keyboard) focused item ref in sync for the tab selection handler.
    React.useEffect(() => {
        const index = activeKey?.startsWith("item-") ? parseInt(activeKey.slice(5), 10) : -1;
        focusedItemRef.current = index >= 0 ? (filteredItems[index] ?? null) : null;
    });

    // Reset the active item when the query changes.
    const previousQuery = React.useRef(inputQuery);
    React.useEffect(() => {
        if (previousQuery.current !== inputQuery) {
            previousQuery.current = inputQuery;
            resetActive();
        }
    }, [inputQuery]);

    const overlayProps = readOverlayProps(contextOverlayProps);
    const open = overlayProps.isOpen ?? (dropdownOpen && !isDisabled);

    React.useEffect(() => {
        if (open) {
            scrollActiveRowIntoView(listRef.current);
        }
    }, [activeKey, open]);

    // --- input interaction ---------------------------------------------------------------------

    const activateActiveRow = (): boolean => {
        if (activeKey === "create") {
            activateCreateRow();
            return true;
        }
        const index = activeKey?.startsWith("item-") ? parseInt(activeKey.slice(5), 10) : -1;
        if (index >= 0 && filteredItems[index] !== undefined) {
            onItemSelect(filteredItems[index]);
            return true;
        }
        return false;
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isDisabled && !open && !["Escape", "Tab", "Shift", "Meta", "Control", "Alt"].includes(event.key)) {
            // `openOnKeyDown`: the dropdown is displayed on keyboard interaction (both modes).
            setDropdownOpen(true);
        }
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp":
                event.preventDefault();
                if (open) {
                    moveActive(event.key === "ArrowDown" ? 1 : -1);
                }
                break;
            case "Enter":
                if (open && activateActiveRow()) {
                    event.preventDefault();
                }
                break;
            case "Escape":
                if (open) {
                    event.preventDefault();
                    event.stopPropagation();
                    setDropdownOpen(false);
                }
                break;
            case "Backspace":
                if (!inputQuery.length && selectedItems.length > 0 && !isDisabled) {
                    // remove the last selected tag
                    const lastIndex = selectedItems.length - 1;
                    (tagInputProps?.onRemove ?? removeTagFromSelectionViaIndex)(
                        itemLabel(selectedItems[lastIndex]),
                        lastIndex,
                    );
                }
                break;
            default:
                break;
        }
        (tagInputProps?.onKeyDown ?? handleOnKeyDown)(event);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputQuery(value);
        if (!isDisabled) {
            setDropdownOpen(true);
        }
        onQueryChange(value);
    };

    const handleTargetClick = () => {
        if (isDisabled) {
            return;
        }
        inputRef.current?.focus();
        if (openOnKeyDown !== true) {
            setDropdownOpen(true);
        }
    };

    // --- tag input target ------------------------------------------------------------------------

    const assignInputRef = (node: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        const externalRef = tagInputProps?.inputRef;
        if (typeof externalRef === "function") {
            externalRef(node);
        } else if (externalRef != null) {
            (externalRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
    };

    const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> = tagInputProps?.inputProps ?? {
        id: "item",
        autoComplete: "off",
        "data-test-id": dataTestId ? dataTestId + "_searchinput" : undefined,
        "data-testid": dataTestid ? dataTestid + "_searchinput" : undefined,
        ...inputProps,
    };

    // Placeholder resolution (Blueprint `TagInput` parity: the tag input level placeholder is only
    // displayed when nothing is selected, an input level placeholder always).
    const defaultPlaceholder =
        placeholder ??
        tagInputProps?.placeholder ??
        (createNewItemFromQuery ? "Search for item, or enter term to create new one..." : undefined);
    const effectivePlaceholder =
        mergedInputProps.placeholder ?? (selectedItems.length === 0 ? defaultPlaceholder : undefined);

    const tagPropsOption = tagInputProps?.tagProps ?? { minimal: true };
    const tagIntent = tagInputProps?.intent ?? intent;
    const effectiveFill = tagInputProps?.fill ?? fullWidth;

    const rightElement = showSpinner ? (
        <Spinner position={"inline"} size={"tiny"} />
    ) : (
        (tagInputProps?.rightElement ?? (
            <>
                {clearButton ?? null}
                {openOnKeyDown !== true && (
                    <IconButton
                        disabled={isDisabled}
                        name={"toggler-caretdown"}
                        data-test-id={dataTestId ? dataTestId + "_toggler" : undefined}
                        data-testid={dataTestid ? dataTestid + "_toggler" : undefined}
                    />
                )}
            </>
        ))
    );

    const tags = selectedItems.map((item, index) => {
        const label = itemLabel(item);
        const userTagProps = typeof tagPropsOption === "function" ? tagPropsOption(label, index) : tagPropsOption;
        return (
            <Tag
                key={`${itemId(item)}-${index}`}
                {...(userTagProps as any)}
                data-tag-index={index}
                onRemove={
                    isDisabled
                        ? undefined
                        : () => (tagInputProps?.onRemove ?? removeTagFromSelectionViaIndex)(label, index)
                }
            >
                {label}
            </Tag>
        );
    });

    const contentMultiSelect = (
        <PopoverPrimitive.Root open={open}>
            <PopoverPrimitive.Anchor asChild>
                <div
                    ref={targetRef}
                    className={cn(`${eccgui}-multiselect__target`, effectiveFill ? "block w-full" : "inline-block")}
                    aria-disabled={isDisabled || undefined}
                    onClick={handleTargetClick}
                    onMouseDown={(event) => {
                        // Keep the focus inside the query input while interacting with tags/buttons.
                        if (event.target !== inputRef.current) {
                            event.preventDefault();
                        }
                    }}
                >
                    <div
                        className={cn(
                            tagInputProps?.className ??
                                `${eccgui}-multisuggestfield ${eccgui}-multiselect` +
                                    (className ? ` ${className}` : ""),
                            tagIntent && intentClassName(tagIntent as IntentTypes),
                            "flex min-h-9 w-full items-center gap-1 rounded-md border border-input bg-transparent px-2 py-1 text-sm",
                            // Stock shadcn focus ring, ported from the former _multisuggestfield.scss
                            // `:focus-within { @extend .eccgui-a11y-focus-by-keyboard-static }` (SCSS
                            // sunset). `focus-within:` (not `focus-visible:`) because the ring sits on
                            // this non-focusable container while focus lands on the nested input.
                            "outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
                            isDisabled ? "cursor-not-allowed opacity-50" : "cursor-text",
                        )}
                    >
                        {tagInputProps?.leftIcon ?? null}
                        <div className="flex min-w-0 grow flex-wrap items-center gap-1">
                            {tags}
                            <input
                                {...mergedInputProps}
                                ref={assignInputRef}
                                type="text"
                                disabled={isDisabled}
                                className={cn(
                                    "min-w-16 grow border-0 bg-transparent p-0 text-sm outline-none",
                                    mergedInputProps.className,
                                )}
                                placeholder={effectivePlaceholder}
                                value={inputQuery}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                onKeyUp={(event) =>
                                    (tagInputProps?.onKeyUp ?? handleOnKeyUp)(
                                        event as React.KeyboardEvent<HTMLElement>,
                                    )
                                }
                                onBlur={(event) => {
                                    setDropdownOpen(false);
                                    mergedInputProps.onBlur?.(event);
                                }}
                            />
                        </div>
                        <span className="flex shrink-0 items-center self-start">{rightElement}</span>
                    </div>
                </div>
            </PopoverPrimitive.Anchor>
            <ComboboxDropdown
                open={open}
                onCloseRequest={() => setDropdownOpen(false)}
                isAnchorInteraction={(target) => !!(target instanceof Node && targetRef.current?.contains(target))}
                overlayProps={overlayProps}
                defaultMatchTargetWidth={fullWidth}
                contentAttributes={{
                    "data-test-id": dataTestId ? dataTestId + "_drowpdown" : undefined,
                    "data-testid": dataTestid ? dataTestid + "_dropdown" : undefined,
                }}
                contentStyle={
                    calculatedMaxHeight
                        ? ({
                              "--eccgui-multisuggestfield-max-height": `${calculatedMaxHeight}`,
                          } as React.CSSProperties)
                        : undefined
                }
            >
                <Menu
                    role="listbox"
                    ulRef={listRef}
                    className="overflow-auto p-1"
                    style={{ maxHeight: "var(--eccgui-multisuggestfield-max-height, 45vh)" }}
                >
                    {rows.length > 0 ? (
                        rows.map(({ key, element }) => <React.Fragment key={key}>{element}</React.Fragment>)
                    ) : (
                        (noResults ?? <MenuItem disabled={true} text={noResultText} />)
                    )}
                </Menu>
            </ComboboxDropdown>
        </PopoverPrimitive.Root>
    );

    return wrapperProps || dataTestId || dataTestid ? (
        <div
            className={`${eccgui}-multiselect__wrapper`}
            {...(wrapperProps ?? {})}
            {...{ "data-test-id": dataTestId, "data-testid": dataTestid }}
        >
            {contentMultiSelect}
        </div>
    ) : (
        <>{contentMultiSelect}</>
    );
}

/**
 * @deprecated (v26) use directly <MultiSuggestField<TYPE>> (`ofType` no longer returns the
 * BlueprintJS element but this component itself).
 */
MultiSuggestField.ofType = <U,>() => MultiSuggestField<U>;

export default MultiSuggestField;
