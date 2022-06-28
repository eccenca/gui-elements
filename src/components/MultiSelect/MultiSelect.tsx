import React from "react";
import {
    Intent as BlueprintIntent,
    HTMLInputProps as BlueprintHTMLInputProps
} from "@blueprintjs/core";
import {
    IItemRendererProps as BlueprintItemRendererProps,
    MultiSelect2 as BlueprintMultiSelect,
    MultiSelect2Props as BlueprintMultiSelectProps
} from "@blueprintjs/select";
import {
    MenuItem,
    Highlighter,
    Button,
    OverflowText,
    ContextOverlayProps,
} from "./../../index";

import {removeExtraSpaces} from "../../common/utils/stringUtils";

export interface SelectedParamsType<T> {
    newlySelected: T;
    selectedItems: T[];
    createdItems: Partial<T>[];
}

interface IProps<T> extends Pick<BlueprintMultiSelectProps<T>, "items" | "placeholder" | "openOnKeyDown"> {
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
    onSelection?: (params: SelectedParamsType<T>) => void;
    /**
     * Props to spread to `ContextOverlay`. Note that `content` cannot be changed.
     */
    contextOverlayProps?: Omit<ContextOverlayProps, "content" | "children">;
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
    createNewItemFromQuery?: (query: string) => T
    /**
     * Items that were newly created and not taken from the list will be post-fixed with this string.
     */
    newItemPostfix?: string
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
}

function MultiSelect<T>({
    items,
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
    ...otherProps
}: IProps<T>) {
    const [createdItems, setCreatedItems] = React.useState<T[]>([]);
    const [itemsCopy, setItemsCopy] = React.useState<T[]>([...items]);
    const [filteredItemList, setFilteredItemList] = React.useState<T[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<T[]>(() => (prePopulateWithItems ? [...items] : []));
    const [query, setQuery] = React.useState<string | undefined>(undefined);
    //currently focused element in popover list
    const [focusedItem, setFocusedItem] = React.useState<T | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

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

    /** update items copy when the items change
     *  e.g for auto-complete when query change
     */
    React.useEffect(() => {
        setItemsCopy([...items, ...createdItems]);
        setFilteredItemList([...items, ...createdItems]);
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [items.map((item) => itemId(item)).join("|")]);

    React.useEffect(() => {
        onSelection &&
            onSelection({
                newlySelected: selectedItems.slice(-1)[0],
                createdItems,
                selectedItems,
            });
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [
        onSelection,
        selectedItems.map((item) => itemId(item)).join("|"),
        createdItems.map((item) => itemId(item)).join("|"),
    ]);

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
        setSelectedItems((items) => items.filter((item) => itemId(item) !== matcher));
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
            setSelectedItems((items) => [...items, item]);
        }
        inputRef.current?.select()
    };

    /**
     * search through item list using "label prop" and update the items popover
     * @param query
     */
    const onQueryChange = async (query: string) => {
        if (query.length) {
            setQuery(query);
            setFilteredItemList([])
            const resultFromQuery = runOnQueryChange && (await runOnQueryChange(removeExtraSpaces(query)));
            setFilteredItemList(() =>
                [...(resultFromQuery ?? itemsCopy), ...createdItems].filter(item =>
                    itemLabel(item).toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };

    // Renders the entries of the (search) options list
    const optionRenderer = (label: string) => {
        return <Highlighter label={label} searchValue={query} />;
    };

    /**
     * defines how an item in the item list is displayed
     */
    const onItemRenderer = (item: T, { handleClick, modifiers }: BlueprintItemRendererProps) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        let label = itemLabel(item)
        if(createdItems.find(created => itemId(created) === itemId(item))) {
            label += newItemPostfix
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
        setSelectedItems([]);
        setFilteredItemList(itemsCopy);
    };

    /**
     * remove a specific item from the multi-select input
     * @param label
     * @param index
     */
    const removeTagFromSelectionViaIndex = (label: React.ReactNode, index: number) => {
        setSelectedItems([...selectedItems.slice(0, index), ...selectedItems.slice(index + 1)]);
        setCreatedItems(items => items.filter(item => itemLabel(item) !== label));
    };

    /**
     * Utility function to create a new Item. createNewItemFromQuery is assumed to be defined!
     */
    const createNewItem = (query: string): T => {
        const newItem = createNewItemFromQuery!!(query);
        //set new items
        setCreatedItems((items) => [...items, newItem]);
        setQuery("");
        itemsCopy.push(newItem);
        return newItem;
    };

    /**
     * added functionality to create new item when there are no matching items on enter keypress
     * @param event
     */
    const handleOnKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" && !filteredItemList.length && !!query && createNewItemFromQuery) {
            createNewItem(query);
        }
        inputRef.current?.focus();
    };

    /**
     * added functionality to either create new item
     * when there are no matching items or select an item on tab keypress
     * @param event
     */
    const handleOnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Tab" && !!query) {
            event.preventDefault();
            focusedItem ? onItemSelect(focusedItem) : onItemSelect(createNewItem(query));
            setQuery("");
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

    const clearButton =
        selectedItems.length > 0 ? (
            <Button icon="operation-clear" data-test-id="clear-all-items" minimal={true} onClick={handleClear} />
        ) : undefined;

    return (
        <BlueprintMultiSelect<T>
            {...otherProps}
            query={query}
            onQueryChange={onQueryChange}
            items={filteredItemList}
            onItemSelect={onItemSelect}
            itemRenderer={onItemRenderer}
            itemsEqual={(a: T, b: T) => itemId(a) === itemId(b)}
            selectedItems={selectedItems}
            noResults={<MenuItem disabled={true} text={noResultText} />}
            tagRenderer={item => itemLabel(item)}
            createNewItemRenderer={newItemRenderer}
            onActiveItemChange={(activeItem) => setFocusedItem(activeItem)}
            fill={fullWidth}
            createNewItemFromQuery={createNewItemFromQuery}
            tagInputProps={{
                inputProps: {
                    id: "item",
                    autoComplete: "off",
                    ...inputProps
                },
                inputRef: inputRef,
                intent,
                addOnBlur: true,
                onKeyDown: handleOnKeyDown,
                onKeyUp: handleOnKeyUp,
                onRemove: removeTagFromSelectionViaIndex,
                rightElement: disabled ? undefined : clearButton,
                tagProps: { minimal: true },
                disabled,
                ...tagInputProps,
            }}
            popoverProps={{
                minimal: true,
                placement: "bottom-start",
                hasBackdrop: true,
                matchTargetWidth: true,
                ...contextOverlayProps,
            }}
        />
    );
}

export default MultiSelect;
