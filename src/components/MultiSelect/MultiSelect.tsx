import React, { useRef } from "react";
import { HTMLInputProps as BlueprintHTMLInputProps, Intent as BlueprintIntent } from "@blueprintjs/core";
import {
    ItemRendererProps as BlueprintItemRendererProps,
    MultiSelect as BlueprintMultiSelect,
    MultiSelectProps as BlueprintMultiSelectProps,
} from "@blueprintjs/select";

import { removeExtraSpaces } from "../../common/utils/stringUtils";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";

import { ContextOverlayProps, Highlighter, IconButton, MenuItem, OverflowText, Spinner } from "./../../index";

export interface MultiSelectSelectionProps<T> {
    newlySelected?: T;
    selectedItems: T[];
    createdItems: Partial<T>[];
}

// @deprecated use `MultiSelectSelectionProps<T>`
export type SelectedParamsType<T> = MultiSelectSelectionProps<T>;

export interface MultiSelectProps<T>
    extends TestableComponent,
        Pick<BlueprintMultiSelectProps<T>, "items" | "placeholder" | "openOnKeyDown"> {
    /**
     * Predefined selected values
     */

    selectedItems?: T[];
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
     * When set to true will set the multi-select value with all the items provided
     */
    prePopulateWithItems?: boolean;
    /**
     *  function handler that would be called anytime an item is selected/deselected or an item is created/removed
     */
    onSelection?: (params: MultiSelectSelectionProps<T>) => void;
    /**
     * Props to spread to `ContextOverlay`. Note that `content` cannot be changed.
     */
    contextOverlayProps?: Partial<Omit<ContextOverlayProps, "content" | "children">>;
    /**
     * Props to spread to `TagInput`. Use `query` and `onQueryChange` to control the input.
     */
    tagInputProps?: BlueprintMultiSelectProps<T>["tagInputProps"];

    /** Additional properties for the (query) input field of the multi-selection. */
    inputProps?: BlueprintHTMLInputProps;

    /**
     * prop to listen for query changes, when text is entered in the multi-select input
     */
    runOnQueryChange?: (query: string) => Promise<T[] | undefined>;
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
     * Allows to creates new item from a given query. If this is not provided then no new items can be created.
     */
    createNewItemFromQuery?: (query: string) => T;
    /**
     * Items that were newly created and not taken from the list will be post-fixed with this string.
     */
    newItemPostfix?: string;
    /**
     * The input element is displayed with primary color scheme.
     */
    hasStatePrimary?: boolean;
    /**
     * The input element is displayed with success (some type of green) color scheme.
     */
    hasStateSuccess?: boolean;
    /**
     * The input element is displayed with success (some type of orange) color scheme.
     */
    hasStateWarning?: boolean;
    /**
     * The input element is displayed with success (some type of red) color scheme.
     */
    hasStateDanger?: boolean;
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
}

/**
 * **Element is deprecated for the current type of usage.**
 * Use `MultiSuggestField` as replacement.
 *
 * This component will be re-implemented later as a `Select` allowing multiple selections.
 * @deprecated
 */
export function MultiSelect<T>({
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
    hasStatePrimary,
    hasStateDanger,
    hasStateSuccess,
    hasStateWarning,
    disabled,
    createNewItemFromQuery,
    requestDelay = 0,
    clearQueryOnSelection = false,
    className,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    wrapperProps,
    ...otherMultiSelectProps
}: MultiSelectProps<T>) {
    // Options created by a user
    const createdItems = useRef<T[]>([]);
    // Options passed ouside (f.e. from the backend)
    const [externalItems, setExternalItems] = React.useState<T[]>([...items]);
    // All options (created and passed) that match the query
    const [filteredItems, setFilteredItems] = React.useState<T[]>([]);
    // All options (created and passed) selected by a user, if the component is uncontrolled
    const [selectedItems, setSelectedItems] = React.useState<T[]>(() =>
        prePopulateWithItems ? [...items] : externalSelectedItems ? [...externalSelectedItems] : []
    );

    //currently focused element in popover list
    const [focusedItem, setFocusedItem] = React.useState<T | null>(null);
    const [showSpinner, setShowSpinner] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const requestState = useRef<{
        query?: string;
        timeoutId?: number;
    }>({});

    let intent;
    switch (true) {
        case hasStatePrimary:
            intent = BlueprintIntent.PRIMARY;
            break;
        case hasStateSuccess:
            intent = BlueprintIntent.SUCCESS;
            break;
        case hasStateWarning:
            intent = BlueprintIntent.WARNING;
            break;
        case hasStateDanger:
            intent = BlueprintIntent.DANGER;
            break;
        default:
            break;
    }

    // If the component is contolled from outside, we don't need to store selected state within the component
    // when user selects or removes selection - options will be set in a parent component
    const isControlled = !!(externalSelectedItems && onSelection);

    /** Update external items when they change
     *  e.g for auto-complete when query change
     */
    React.useEffect(() => {
        setExternalItems(items);
        setFilteredItems([...items, ...createdItems.current]);
    }, [items.map((item) => itemId(item)).join("|")]);

    React.useEffect(() => {
        !isControlled &&
            onSelection &&
            onSelection({
                newlySelected: selectedItems.slice(-1)[0],
                createdItems: createdItems.current,
                selectedItems,
            });
    }, [
        isControlled,
        onSelection,
        selectedItems.map((item) => itemId(item)).join("|"),
        createdItems.current.map((item) => itemId(item)).join("|"),
    ]);

    /**
     * Update selected items if the component is controlled and we get
     * new selected items from outside
     */
    React.useEffect(() => {
        if (!isControlled) {
            return;
        }

        setSelectedItems(externalSelectedItems);
    }, [isControlled, externalSelectedItems]);

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
        const filteredItems = selectedItems.filter((item) => itemId(item) !== matcher);

        if (isControlled) {
            onSelection({
                createdItems: createdItems.current,
                selectedItems: filteredItems,
            });
        } else {
            setSelectedItems(filteredItems);
        }
    };

    /**
     * selects and deselects an item from selection list
     * if the item exists it removes it instead
     * @param item
     */
    const onItemSelect = (item: T) => {
        if (itemHasBeenSelectedAlready(itemId(item))) {
            removeItemSelection(itemId(item));
        } else if (isControlled) {
            onSelection({
                newlySelected: item,
                createdItems: createdItems.current,
                selectedItems: [...selectedItems, item],
            });
        } else {
            setSelectedItems((items) => [...items, item]);
        }

        if (clearQueryOnSelection) {
            requestState.current.query = "";
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
            const fn = async () => {
                setShowSpinner(true);
                setFilteredItems([]);
                const resultFromQuery = runOnQueryChange && (await runOnQueryChange(removeExtraSpaces(query)));
                if (requestState.current.query === query) {
                    // Only use most recent request
                    const outsideOptions = [...(resultFromQuery ?? externalItems)];
                    setFilteredItems(
                        [...outsideOptions, ...createdItems.current].filter((item) =>
                            itemLabel(item).toLowerCase().includes(query.toLowerCase())
                        )
                    );
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
    const onItemRenderer = (item: T, { handleClick, modifiers }: BlueprintItemRendererProps) => {
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

        if (isControlled) {
            onSelection({
                selectedItems: [],
                createdItems: createdItems.current,
            });
        } else {
            setSelectedItems([]);
        }

        setFilteredItems([...externalItems, ...createdItems.current]);
    };

    /**
     * remove a specific item from the multi-select input
     * @param label
     * @param index
     */
    const removeTagFromSelectionViaIndex = (label: React.ReactNode, index: number) => {
        setSelectedItems([...selectedItems.slice(0, index), ...selectedItems.slice(index + 1)]);
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
        return newItem;
    };

    /**
     * added functionality to create new item when there are no matching items on enter keypress
     * @param event
     */
    const handleOnKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" && !filteredItems.length && !!requestState.current.query && createNewItemFromQuery) {
            createNewItem(requestState.current.query);
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
            focusedItem ? onItemSelect(focusedItem) : onItemSelect(createNewItem(requestState.current.query));
            requestState.current.query = "";
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
        if (!createNewItemFromQuery) return undefined;
        const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
            createNewItem(label);
            handleClick(e);
        };
        return (
            <MenuItem
                id={"new-item"}
                icon="item-add-artefact"
                active={active}
                key={label}
                onClick={clickHandler}
                text={<OverflowText>{`${newItemCreationText} '${label}'`}</OverflowText>}
            />
        );
    };

    // Clear button and spinner are both shown as "right element"
    const clearButton =
        selectedItems.length > 0 ? (
            <IconButton
                disabled={disabled}
                name="operation-clear"
                data-test-id="clear-all-items" // @deprecated should be created from the given testid plus `_clearance` suffix
                onClick={handleClear}
            />
        ) : undefined;

    const spinnerProps = showSpinner
        ? {
              rightElement: <Spinner position={"inline"} size={"tiny"} />,
          }
        : {};

    const contentMultiSelect = (
        <BlueprintMultiSelect<T>
            {...otherMultiSelectProps}
            query={requestState.current.query}
            onQueryChange={onQueryChange}
            items={filteredItems}
            onItemSelect={onItemSelect}
            itemRenderer={onItemRenderer}
            itemsEqual={(a: T, b: T) => itemId(a) === itemId(b)}
            selectedItems={selectedItems}
            noResults={<MenuItem disabled={true} text={noResultText} />}
            tagRenderer={(item) => itemLabel(item)}
            createNewItemRenderer={newItemRenderer}
            onActiveItemChange={(activeItem) => setFocusedItem(activeItem)}
            fill={fullWidth}
            createNewItemFromQuery={createNewItemFromQuery}
            disabled={disabled}
            tagInputProps={{
                inputProps: {
                    id: "item",
                    autoComplete: "off",
                    "data-test-id": dataTestId ? dataTestId + "_searchinput" : undefined,
                    "data-testid": dataTestid ? dataTestid + "_searchinput" : undefined,
                    ...inputProps,
                } as React.InputHTMLAttributes<HTMLInputElement>,
                className: `${eccgui}-multiselect` + (className ? ` ${className}` : ""),
                fill: fullWidth,
                inputRef: inputRef,
                intent,
                addOnBlur: true,
                onKeyDown: handleOnKeyDown,
                onKeyUp: handleOnKeyUp,
                onRemove: removeTagFromSelectionViaIndex,
                rightElement: (
                    <>
                        {clearButton ?? null}
                        {otherMultiSelectProps.openOnKeyDown !== true && (
                            <IconButton
                                disabled={disabled}
                                name={"toggler-caretdown"}
                                data-test-id={dataTestId ? dataTestId + "_toggler" : undefined}
                                data-testid={dataTestid ? dataTestid + "_toggler" : undefined}
                            />
                        )}
                    </>
                ),
                tagProps: { minimal: true },
                disabled,
                ...tagInputProps,
                ...spinnerProps,
            }}
            popoverTargetProps={{
                className: `${eccgui}-multiselect__target`,
            }}
            popoverProps={{
                minimal: true,
                placement: "bottom-start",
                matchTargetWidth: fullWidth,
                ...contextOverlayProps,
            }}
            popoverContentProps={
                {
                    "data-test-id": dataTestId ? dataTestId + "_drowpdown" : undefined,
                    "data-testid": dataTestid ? dataTestid + "_dropdown" : undefined,
                } as BlueprintMultiSelectProps<T>["popoverContentProps"]
            }
        />
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

/** @deprecated */
/*
function ofType<U>() {
    return (props: MultiSelectProps<U>) => <MultiSelect<U> {...props} />;
}
// */

// we still return the Blueprint element here because it was already used like that
// MultiSelect.ofType = ofType;
MultiSelect.ofType = BlueprintMultiSelect.ofType;

export default MultiSelect;
