import React, { useRef } from "react";
import { Classes as BlueprintClasses, HTMLInputProps as BlueprintHTMLInputProps, mergeRefs } from "@blueprintjs/core";
import {
    ItemRendererProps as BlueprintItemRendererProps,
    MultiSelect as BlueprintMultiSelect,
    MultiSelectProps as BlueprintMultiSelectProps,
} from "@blueprintjs/select";
import classNames from "classnames";

import { IntentBlueprint } from "../../common/Intent";
import { removeExtraSpaces } from "../../common/utils/stringUtils";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";
import { MenuItemProps } from "../Menu/MenuItem";

import {
    ContextOverlayProps,
    Highlighter,
    highlighterUtils,
    IconButton,
    MenuItem,
    OverflowText,
    Spinner,
} from "./../../index";

export interface MultiSuggestFieldSelectionProps<T> {
    newlySelected?: T;
    newlyRemoved?: T;
    selectedItems: T[];
    createdItems: Partial<T>[];
}

export interface MultiSuggestFieldCommonProps<T>
    extends
        TestableComponent,
        Pick<
            BlueprintMultiSelectProps<T>,
            "items" | "placeholder" | "openOnKeyDown" | "noResults" | "createNewItemRenderer"
        >,
        Partial<Pick<BlueprintMultiSelectProps<T>, "itemRenderer">> {
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
    tagInputProps?: BlueprintMultiSelectProps<T>["tagInputProps"];

    /** Additional properties for the (query) input field of the multi-selection. */
    inputProps?: BlueprintHTMLInputProps;

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
    intent?: IntentBlueprint | "accent";
    /**
     * Disables the input element
     */
    disabled?: boolean;

    /**
     * Delay in ms how long the request for the given query should be delayed.
     */
    requestDelay?: number;

    /**
     * Clear query when an existing option is selected or unselected. Defaults to false to preserve the filter.
     * Creating a new item always clears the query.
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
    ...otherMultiSelectProps
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

    const [showSpinner, setShowSpinner] = React.useState(false);
    const [selectionAnnouncement, setSelectionAnnouncement] = React.useState("");
    const [keepOpenAfterSelection, setKeepOpenAfterSelection] = React.useState(false);
    const optionIds = React.useRef(new Map<string, string>());
    const createdOptionId = React.useId();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const requestState = useRef<{
        query?: string;
        timeoutId?: number;
    }>({});
    const selectionChange = useRef<SelectionChange>({ type: "none" });

    React.useLayoutEffect(() => {
        const input = inputRef.current;
        const target = input?.closest(`.${eccgui}-multiselect__target`);
        if (!input || !target) return;

        // Blueprint puts the combobox role on a wrapper; active-descendant navigation needs it on the focused input.
        target.removeAttribute("role");
        const updateExpandedState = () => {
            const expanded = target.getAttribute("aria-expanded") ?? "false";
            input.setAttribute("aria-expanded", expanded);
            if (expanded === "false") input.removeAttribute("aria-activedescendant");
        };
        updateExpandedState();
        const observer = new MutationObserver(updateExpandedState);
        observer.observe(target, { attributes: true, attributeFilter: ["aria-expanded"] });
        return () => observer.disconnect();
    }, []);

    /** Update external items when they change
     *  e.g for auto-complete when query change
     */
    React.useEffect(() => {
        setExternalItems(items);
        if (!requestState.current.query || !runOnQueryChange) {
            setFilteredItems(filterItems([...items, ...createdItems.current], requestState.current.query ?? ""));
        }
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
        const removedItem = selectedItems.find((item) => itemId(item) === matcher);
        if (removedItem) {
            setSelectionAnnouncement(`Removed ${itemLabel(removedItem)}`);
        }
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

    const filterItems = (items: T[], query: string): T[] => {
        if (!query) return items;
        if (searchListPredicate) return searchListPredicate(items, query);
        if (searchPredicate) return items.filter((item) => searchPredicate(item, query));
        return defaultSearchListPredicate(items, query);
    };

    /**
     * selects and deselects an item from selection list
     * if the item exists it removes it instead
     * @param item
     */
    const onItemSelect = (item: T) => {
        const isNewItem = !!createNewItemFromQuery && !filteredItems.some((option) => itemId(option) === itemId(item));
        if (isNewItem && !createdItems.current.some((created) => itemId(created) === itemId(item))) {
            createdItems.current = [...createdItems.current, item];
        }
        inputRef.current?.removeAttribute("aria-activedescendant");
        if (itemHasBeenSelectedAlready(itemId(item))) {
            removeItemSelection(itemId(item));
        } else {
            setSelectionAnnouncement(`Selected ${itemLabel(item)}`);
            selectionChange.current = { type: "selected", item };
            setSelectedItems((items) => [...items, item]);
        }

        if (isNewItem || clearQueryOnSelection) {
            // Blueprint otherwise closes a keyboard-opened popup when the cleared query reaches its QueryList.
            setKeepOpenAfterSelection(true);
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
            setShowSpinner(true);
            setFilteredItems([]);
            const fn = async () => {
                const resultFromQuery = runOnQueryChange && (await runOnQueryChange(removeExtraSpaces(query)));
                if (requestState.current.query === query) {
                    // Only use most recent request
                    const outsideOptions = [...(resultFromQuery ?? externalItems)];
                    setFilteredItems(filterItems([...outsideOptions, ...createdItems.current], query));
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
                roleStructure="listoption"
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
        setSelectionAnnouncement("Selection cleared");

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
        const removedItem = selectedItems[index];
        if (removedItem) {
            setSelectionAnnouncement(`Removed ${itemLabel(removedItem)}`);
        }
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
        return newItem;
    };

    /**
     * added functionality to create new item when there are no matching items on enter keypress
     * @param event
     */
    const handleOnKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.target !== inputRef.current) {
            return;
        }
        if (event.key === "Enter" && !filteredItems.length && !!requestState.current.query && createNewItemFromQuery) {
            if (!isValidNewOption || isValidNewOption(requestState.current.query)) {
                createNewItem(requestState.current.query);
            }
        }
        inputRef.current?.focus();
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
        const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
            createNewItem(label);
            handleClick(e);
        };
        return (
            <MenuItem
                roleStructure="listoption"
                id={"new-item"}
                icon="item-add-artefact"
                active={active}
                key={label}
                onClick={clickHandler}
                shouldDismissPopover={false}
                text={<OverflowText>{`${newItemCreationText} '${label}'`}</OverflowText>}
            />
        );
    };

    const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (!event.defaultPrevented && !event.nativeEvent.isComposing && ["Enter", " "].includes(event.key)) {
            event.preventDefault();
            // Clicking focuses the input; prevent QueryList from selecting again on the ensuing input keyup.
            event.stopPropagation();
            event.currentTarget.click();
        }
    };

    const renderOption = (item: T, props: BlueprintItemRendererProps) => {
        const rendered = otherMultiSelectProps.itemRenderer
            ? otherMultiSelectProps.itemRenderer(item, props)
            : onItemRenderer(item, props);
        if (!React.isValidElement<MenuItemProps>(rendered) || rendered.type !== MenuItem) {
            return rendered;
        }
        const optionId = props.id ?? `${createdOptionId}-item-${props.index}`;
        const isSelected = itemHasBeenSelectedAlready(itemId(item));
        const hasSelectionIcon = rendered.props.icon === "state-checked" || rendered.props.icon === "state-unchecked";
        optionIds.current.set(itemId(item), optionId);
        return React.cloneElement(rendered, {
            roleStructure: "listoption",
            onKeyDown: (event) => {
                rendered.props.onKeyDown?.(event);
                handleOptionKeyDown(event);
            },
            // Blueprint adds its own tick for selected options, which duplicates our checkbox icon.
            selected: isSelected && !hasSelectionIcon,
            ref: mergeRefs(props.ref, (element: HTMLLIElement | null) => {
                if (element) {
                    element.id = optionId;
                    element.setAttribute("aria-label", itemLabel(item));
                    element.setAttribute("aria-selected", String(isSelected));
                    if (element.parentElement?.id) {
                        inputRef.current?.setAttribute("aria-controls", element.parentElement.id);
                    }
                    if (props.modifiers.active) {
                        inputRef.current?.setAttribute("aria-activedescendant", optionId);
                    }
                }
            }),
        });
    };

    const renderCreateOption = (label: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => {
        const rendered = otherMultiSelectProps.createNewItemRenderer
            ? otherMultiSelectProps.createNewItemRenderer(label, active, handleClick)
            : newItemRenderer(label, active, handleClick);
        return rendered && React.isValidElement<MenuItemProps>(rendered) && rendered.type === MenuItem
            ? React.cloneElement(rendered, {
                  roleStructure: "listoption",
                  onKeyDown: (event) => {
                      rendered.props.onKeyDown?.(event);
                      handleOptionKeyDown(event);
                  },
                  selected: false,
                  ref: (element: HTMLLIElement | null) => {
                      if (element) {
                          element.id = createdOptionId;
                          if (element.parentElement?.id) {
                              inputRef.current?.setAttribute("aria-controls", element.parentElement.id);
                          }
                          if (active) {
                              inputRef.current?.setAttribute("aria-activedescendant", createdOptionId);
                          }
                      }
                  },
              })
            : rendered;
    };

    const providedTagProps = tagInputProps?.tagProps;
    const getTagProps: NonNullable<BlueprintMultiSelectProps<T>["tagInputProps"]>["tagProps"] = (tag, index) => {
        const props = typeof providedTagProps === "function" ? providedTagProps(tag, index) : (providedTagProps ?? {});
        return {
            minimal: true,
            ...props,
            onKeyDownCapture: (event: React.KeyboardEvent<HTMLSpanElement>) => {
                props.onKeyDownCapture?.(event);
                if ((event.target as HTMLElement).matches(`.${BlueprintClasses.TAG_REMOVE}`)) {
                    event.stopPropagation();
                }
            },
            onKeyUpCapture: (event: React.KeyboardEvent<HTMLSpanElement>) => {
                props.onKeyUpCapture?.(event);
                if ((event.target as HTMLElement).matches(`.${BlueprintClasses.TAG_REMOVE}`)) {
                    event.stopPropagation();
                }
            },
            ref: mergeRefs(typeof props.ref === "string" ? undefined : props.ref, (element: HTMLSpanElement | null) => {
                // Blueprint hardcodes the same accessible name for every tag's remove button.
                const removeButton = element?.querySelector<HTMLButtonElement>(`.${BlueprintClasses.TAG_REMOVE}`);
                if (removeButton && selectedItems[index]) {
                    removeButton.setAttribute("aria-label", `Removing tag '${itemLabel(selectedItems[index])}'`);
                }
            }),
        };
    };

    // Clear button and spinner are both shown as "right element"
    const clearButton =
        selectedItems.length > 0 ? (
            <IconButton
                disabled={disabled}
                name="operation-clear"
                text="Clear all selected items"
                aria-label="Clear all selected items"
                tooltipAsTitle
                data-test-id={dataTestId ? dataTestId + "_clearance" : undefined}
                data-testid={dataTestid ? dataTestid + "_clearance" : undefined}
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
            placeholder={
                !otherMultiSelectProps.placeholder && createNewItemFromQuery
                    ? "Search for item, or enter term to create new one..."
                    : undefined
            }
            query={requestState.current.query}
            onQueryChange={onQueryChange}
            items={filteredItems}
            onItemSelect={onItemSelect}
            itemsEqual={(a: T, b: T) => itemId(a) === itemId(b)}
            selectedItems={selectedItems}
            noResults={<MenuItem roleStructure="listoption" disabled={true} text={noResultText} />}
            tagRenderer={(item) => itemLabel(item)}
            fill={fullWidth}
            createNewItemFromQuery={createNewItemFromQuery}
            disabled={disabled}
            tagInputProps={{
                inputProps: {
                    id: "item",
                    autoComplete: "off",
                    role: "combobox",
                    "aria-haspopup": "listbox",
                    "aria-autocomplete": "list",
                    "data-test-id": dataTestId ? dataTestId + "_searchinput" : undefined,
                    "data-testid": dataTestid ? dataTestid + "_searchinput" : undefined,
                    ...inputProps,
                    onBlur: (event) => {
                        event.currentTarget.removeAttribute("aria-activedescendant");
                        inputProps?.onBlur?.(event);
                    },
                } as React.InputHTMLAttributes<HTMLInputElement>,
                className: classNames(`${eccgui}-multisuggestfield`, `${eccgui}-multiselect`, className, {
                    [`${eccgui}-intent--${intent}`]: intent === "accent",
                }),
                fill: fullWidth,
                inputRef: inputRef,
                intent: intent && intent !== "accent" ? intent : undefined,
                addOnBlur: true,
                onKeyUp: handleOnKeyUp,
                onRemove: removeTagFromSelectionViaIndex,
                rightElement: (
                    <>
                        {clearButton ?? null}
                        {otherMultiSelectProps.openOnKeyDown !== true && (
                            <IconButton
                                disabled={disabled}
                                name={"toggler-caretdown"}
                                text="Show options"
                                aria-label="Show options"
                                tooltipAsTitle
                                data-test-id={dataTestId ? dataTestId + "_toggler" : undefined}
                                data-testid={dataTestid ? dataTestid + "_toggler" : undefined}
                            />
                        )}
                    </>
                ),
                disabled,
                ...tagInputProps,
                tagProps: getTagProps,
                ...spinnerProps,
            }}
            popoverProps={{
                minimal: true,
                placement: "bottom-start",
                matchTargetWidth: fullWidth,
                ...contextOverlayProps,
                onClosing: (node) => {
                    setKeepOpenAfterSelection(false);
                    contextOverlayProps?.onClosing?.(node);
                },
                onOpening: (node) => {
                    // Blueprint makes the whole overlay live, which announces every option when it opens.
                    node.closest(`.${BlueprintClasses.OVERLAY}`)?.setAttribute("aria-live", "off");
                    contextOverlayProps?.onOpening?.(node);
                },
            }}
            popoverContentProps={
                {
                    "data-test-id": dataTestId ? dataTestId + "_drowpdown" : undefined,
                    "data-testid": dataTestid ? dataTestid + "_dropdown" : undefined,
                    style: calculatedMaxHeight
                        ? ({
                              "--eccgui-multisuggestfield-max-height": `${calculatedMaxHeight}`,
                          } as React.CSSProperties)
                        : undefined,
                } as BlueprintMultiSelectProps<T>["popoverContentProps"]
            }
            {...otherMultiSelectProps}
            openOnKeyDown={keepOpenAfterSelection ? false : otherMultiSelectProps.openOnKeyDown}
            popoverTargetProps={{
                className: `${eccgui}-multiselect__target`,
                onKeyDown: (event) => {
                    // Blueprint explicitly blurs on Escape before invoking this handler.
                    if (event.key === "Escape") inputRef.current?.focus();
                },
            }}
            itemRenderer={renderOption}
            createNewItemRenderer={renderCreateOption}
            onActiveItemChange={(activeItem, isCreateNewItem) => {
                const optionId = isCreateNewItem
                    ? createdOptionId
                    : activeItem
                      ? optionIds.current.get(itemId(activeItem))
                      : undefined;
                if (optionId) {
                    inputRef.current?.setAttribute("aria-activedescendant", optionId);
                } else {
                    inputRef.current?.removeAttribute("aria-activedescendant");
                }
            }}
        />
    );

    return wrapperProps || dataTestId || dataTestid ? (
        <div
            className={`${eccgui}-multiselect__wrapper`}
            {...(wrapperProps ?? {})}
            {...{ "data-test-id": dataTestId, "data-testid": dataTestid }}
        >
            {contentMultiSelect}
            <span role="status" className="cds--visually-hidden">
                {selectionAnnouncement}
            </span>
        </div>
    ) : (
        <>
            {contentMultiSelect}
            <span role="status" className="cds--visually-hidden">
                {selectionAnnouncement}
            </span>
        </>
    );
}
