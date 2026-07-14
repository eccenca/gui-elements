import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import { Button, ButtonProps } from "@/components/atoms/Button/Button";
import { ContextOverlayProps } from "@/components/molecules/ContextOverlay";
import Icon from "@/components/atoms/Icon/Icon";
import { TestableComponent } from "@/components/interfaces";
import Menu from "@/components/molecules/Menu/Menu";
import { TextField, TextFieldProps } from "@/components/atoms/TextField/TextField";
import OverflowText from "@/components/atoms/Typography/OverflowText";

import {
    ComboboxCreateNewItemRenderer,
    ComboboxDropdown,
    ComboboxItemRenderer,
    ComboboxItemsEqualProp,
    executeItemsEqual,
    readOverlayProps,
    scrollActiveRowIntoView,
    useActiveRow,
} from "@/components/organisms/AutocompleteField/internalComboboxParts";

/**
 * Properties mirroring the former `@blueprintjs/select` `SelectProps<T>` surface (minus the
 * popover related props that were already excluded before). Kept structurally identical so that
 * existing usages continue to compile unchanged.
 */
export interface SelectBaseProps<T> {
    /** The list of (unfiltered) items. */
    items: T[];
    /**
     * Renders a single option of the select list. Receives the item plus Blueprint-shaped render
     * props (`handleClick`, `modifiers`, `query`, `index`). Return `null` to skip the item.
     */
    itemRenderer: ComboboxItemRenderer<T>;
    /** Invoked when an item from the list is selected. */
    onItemSelect: (item: T, event?: React.SyntheticEvent<HTMLElement>) => void;
    /** Controlled active (keyboard highlighted) item. */
    activeItem?: T | null;
    /** Invoked when the active (keyboard highlighted) item changes. */
    onActiveItemChange?: (activeItem: T | null, isCreateNewItem: boolean) => void;
    /** Custom equality between two items, either a comparator or the name of a property to compare. */
    itemsEqual?: ComboboxItemsEqualProp<T>;
    /** Whether an item is non-interactive, either a callback or the name of a boolean property. */
    itemDisabled?: ((item: T, index: number) => boolean) | keyof T;
    /** Customize the filtering of individual items for the entered query. */
    itemPredicate?: (query: string, item: T, index?: number, exactMatch?: boolean) => boolean;
    /** Customize the filtering of the whole item list for the entered query. */
    itemListPredicate?: (query: string, items: T[]) => T[];
    /**
     * Content displayed instead of the item list when the query is empty. Pass `null` to display
     * nothing for an empty query (dropdown only with query).
     */
    initialContent?: React.ReactNode | null;
    /** Content displayed when no items match the current query. */
    noResults?: React.ReactNode;
    /** Invoked when the query changes. */
    onQueryChange?: (query: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
    /** Controlled query value. */
    query?: string;
    /** Allows to create a new item from the entered query. */
    createNewItemFromQuery?: (query: string) => T | T[];
    /** Renders the "create new item" option. Return `undefined` to not display it for the query. */
    createNewItemRenderer?: ComboboxCreateNewItemRenderer;
    /** Where the "create new item" option is displayed in the list. */
    createNewItemPosition?: "first" | "last";
    /** Reset the query when the dropdown closes. */
    resetOnClose?: boolean;
    /** Reset the active item when the query changes. Defaults to `true`. */
    resetOnQuery?: boolean;
    /** Reset the query when an item is selected. */
    resetOnSelect?: boolean;
    /** Kept for API compatibility (the active item is always scrolled into view). */
    scrollToActiveItem?: boolean;
    /** Whether the select (and its default target) is non-interactive. */
    disabled?: boolean;
    /** Use the full width of the parent container for the select target and the dropdown. */
    fill?: boolean;
    /** Whether the dropdown contains an input to filter the items. Defaults to `true`. */
    filterable?: boolean;
    /** Props for the filter input inside the dropdown. */
    inputProps?: TextFieldProps;
    /** HTML attributes to spread to the item list (`Menu`) element. */
    menuProps?: React.HTMLAttributes<HTMLUListElement>;
    /** Custom select target. If not given a default button target is used. */
    children?: React.ReactNode;
    /** Additional CSS classes for the select target wrapper. */
    className?: string;
}

export interface SelectProps<T> extends TestableComponent, SelectBaseProps<T>, Pick<ButtonProps, "icon" | "rightIcon"> {
    /**
     * Textual representation of the the selected value.
     * This is displayed if the select target is not controlled directly via `children` elements.
     */
    text?: string;
    /**
     * Placeholder text displayed for selects without defined `text`.
     * This is displayed if the select target is not controlled directly via `children` elements.
     */
    placeholder?: string;
    /**
     * Props to spread to `ContextOverlay` that is used to display the dropdown.
     */
    contextOverlayProps?: Partial<
        Omit<ContextOverlayProps, "content" | "defaultIsOpen" | "disabled" | "fill" | "renderTarget" | "targetTagName">
    >;
    /**
     * Event handler to reset search input.
     * Only works with the uncontrolled default select target.
     * If set then `rightElement` is automatically set with an action button to trigger the handler.
     */
    onClearanceHandler?: () => void;
    /**
     * Tooltip to show for the clear button.
     * Only works with the uncontrolled default select target.
     */
    onClearanceText?: string;
    /**
     * If set then a `div` element is used as wrapper.
     * It uses the attributes given via this property.
     */
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * Create a Select box without the HTML select element.
 * It is possible to filter options, as well as to add new options if necessary.
 *
 * **Use this input element when the value is primarily selected from a defined set of elements.**
 */
export function Select<T>({
    contextOverlayProps,
    className,
    children,
    text,
    placeholder = "Select item ...",
    icon,
    rightIcon,
    onClearanceHandler,
    inputProps,
    onClearanceText = "Reset selection",
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    wrapperProps,
    items,
    itemRenderer,
    onItemSelect,
    activeItem: controlledActiveItem,
    onActiveItemChange,
    itemsEqual,
    itemDisabled,
    itemPredicate,
    itemListPredicate,
    initialContent,
    noResults,
    onQueryChange,
    query: controlledQuery,
    createNewItemFromQuery,
    createNewItemRenderer,
    createNewItemPosition = "first",
    resetOnClose = false,
    resetOnQuery = true,
    resetOnSelect = false,
    disabled = false,
    fill,
    filterable = true,
    menuProps,
}: SelectProps<T>) {
    const overlayProps = readOverlayProps(contextOverlayProps);
    const [internalOpen, setInternalOpen] = React.useState(false);
    const [internalQuery, setInternalQuery] = React.useState("");
    const query = controlledQuery ?? internalQuery;
    const targetRef = React.useRef<HTMLSpanElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);
    const filterInputRef = React.useRef<HTMLInputElement>(null);

    const open = overlayProps.isOpen ?? (internalOpen && !disabled);

    const changeQuery = (newQuery: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setInternalQuery(newQuery);
        onQueryChange?.(newQuery, event);
    };

    const closeDropdown = (refocusTarget = false) => {
        setInternalOpen(false);
        if (resetOnClose) {
            changeQuery("");
        }
        if (refocusTarget) {
            (targetRef.current?.querySelector("button, input, a, [tabindex]") as HTMLElement | null)?.focus?.();
        }
    };

    // --- filtering -----------------------------------------------------------------------------
    const filteredItems = React.useMemo(() => {
        if (itemListPredicate) {
            return itemListPredicate(query, items);
        }
        if (itemPredicate) {
            return items.filter((item, index) => itemPredicate(query, item, index));
        }
        return items;
    }, [items, query, itemListPredicate, itemPredicate]);

    const isItemDisabled = (item: T, index: number): boolean => {
        if (itemDisabled === undefined) {
            return false;
        }
        return typeof itemDisabled === "function" ? itemDisabled(item, index) : !!item[itemDisabled];
    };

    // --- create new item row -------------------------------------------------------------------
    const createdForQuery =
        createNewItemFromQuery && createNewItemRenderer && query !== "" ? createNewItemFromQuery(query) : undefined;
    const firstCreated = Array.isArray(createdForQuery) ? createdForQuery[0] : createdForQuery;
    const showCreateRow =
        firstCreated !== undefined && !items.some((existing) => executeItemsEqual(itemsEqual, existing, firstCreated));

    // --- active row handling ---------------------------------------------------------------------
    // Rows are keyed by their filtered-list index ("item-<i>") resp. "create" for the create option.
    const itemKeyOf = (index: number) => `item-${index}`;
    const selectItem = (item: T, event?: React.SyntheticEvent<HTMLElement>) => {
        onItemSelect(item, event);
        if (resetOnSelect) {
            changeQuery("");
        }
        closeDropdown(true);
    };
    const createFromQuery = (event?: React.SyntheticEvent<HTMLElement>) => {
        if (!createNewItemFromQuery) {
            return;
        }
        const created = createNewItemFromQuery(query);
        (Array.isArray(created) ? created : [created]).forEach((item) => onItemSelect(item, event));
        if (resetOnSelect) {
            changeQuery("");
        }
        closeDropdown(true);
    };

    // Render all rows first (renderers may return null/undefined and thereby remove rows).
    const buildRows = (activeKey: string | undefined) => {
        const rows: { key: string; disabled?: boolean; element: React.JSX.Element }[] = [];
        const createElement = showCreateRow
            ? createNewItemRenderer!(query, activeKey === "create", (event) => createFromQuery(event))
            : undefined;
        if (createElement && createNewItemPosition === "first") {
            rows.push({ key: "create", element: createElement });
        }
        filteredItems.forEach((item, index) => {
            const disabledItem = isItemDisabled(item, index);
            const element = itemRenderer(item, {
                handleClick: (event) => {
                    if (!disabledItem) {
                        selectItem(item, event);
                    }
                },
                handleFocus: () => {},
                index,
                modifiers: {
                    active: activeKey === itemKeyOf(index),
                    disabled: disabledItem,
                    matchesPredicate: true,
                },
                query,
            });
            if (element) {
                rows.push({ key: itemKeyOf(index), disabled: disabledItem, element });
            }
        });
        if (createElement && createNewItemPosition !== "first") {
            rows.push({ key: "create", element: createElement });
        }
        return rows;
    };

    // First pass determines which rows exist for keyboard navigation.
    const navRows = buildRows(undefined).map(({ key, disabled: rowDisabled }) => ({ key, disabled: rowDisabled }));
    const { activeKey, moveActive, resetActive } = useActiveRow(navRows);
    // Second pass renders the rows with the effective active flags.
    let rows = buildRows(activeKey);
    // Controlled active item (rarely used): overrides the internal roving state.
    if (controlledActiveItem !== undefined) {
        const controlledIndex = filteredItems.findIndex((item) =>
            executeItemsEqual(itemsEqual, item, controlledActiveItem ?? undefined),
        );
        rows = buildRows(controlledIndex >= 0 ? itemKeyOf(controlledIndex) : undefined);
    }

    // Notify about active item changes (Blueprint `onActiveItemChange`).
    const lastActiveNotified = React.useRef<string | undefined>(undefined);
    React.useEffect(() => {
        if (!onActiveItemChange || lastActiveNotified.current === activeKey) {
            return;
        }
        lastActiveNotified.current = activeKey;
        if (activeKey === "create") {
            onActiveItemChange(null, true);
        } else {
            const index = activeKey ? parseInt(activeKey.replace("item-", ""), 10) : -1;
            onActiveItemChange(index >= 0 ? (filteredItems[index] ?? null) : null, false);
        }
    });

    // Reset the active item when the query changes (Blueprint `resetOnQuery`, default true).
    const previousQuery = React.useRef(query);
    React.useEffect(() => {
        if (previousQuery.current !== query) {
            previousQuery.current = query;
            if (resetOnQuery) {
                resetActive();
            }
        }
    }, [query, resetOnQuery]);

    React.useEffect(() => {
        if (open) {
            scrollActiveRowIntoView(listRef.current);
        }
    }, [activeKey, open]);

    // Focus the filter input when the dropdown opens.
    React.useEffect(() => {
        if (open && filterable) {
            const timeout = window.setTimeout(() => filterInputRef.current?.focus(), 0);
            return () => window.clearTimeout(timeout);
        }
        return;
    }, [open, filterable]);

    const activateRow = (event?: React.SyntheticEvent<HTMLElement>): boolean => {
        if (activeKey === "create") {
            createFromQuery(event);
            return true;
        }
        const index = activeKey ? parseInt(activeKey.replace("item-", ""), 10) : -1;
        const item = index >= 0 ? filteredItems[index] : undefined;
        if (item !== undefined) {
            selectItem(item, event);
            return true;
        }
        return false;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (disabled) {
            return;
        }
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp":
                event.preventDefault();
                if (!open) {
                    setInternalOpen(true);
                } else {
                    moveActive(event.key === "ArrowDown" ? 1 : -1);
                }
                break;
            case "Enter":
                if (open) {
                    event.preventDefault();
                    event.stopPropagation();
                    activateRow(event);
                }
                break;
            case "Escape":
                if (open) {
                    event.preventDefault();
                    event.stopPropagation();
                    closeDropdown(true);
                }
                break;
            default:
                break;
        }
    };

    // --- target ----------------------------------------------------------------------------------
    const defaultTarget = (
        <Button
            // Reads like the stock shadcn `SelectTrigger`: neutral outlined control, value left,
            // caret right (`justify-between`), normal weight, transparent fill, `px-3`.
            className="justify-between bg-transparent px-3 font-normal"
            text={text ? <OverflowText>{text}</OverflowText> : <OverflowText>{placeholder}</OverflowText>}
            alignText="left"
            outlined
            fill={fill ?? false}
            disabled={disabled}
            icon={icon}
            rightIcon={
                <>
                    {onClearanceHandler && text && (
                        <Icon
                            name="operation-clear"
                            small
                            tooltipText={onClearanceText ? onClearanceText : undefined}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClearanceHandler();
                            }}
                        />
                    )}
                    {typeof rightIcon === "string" ? (
                        <Icon name={rightIcon} small />
                    ) : (
                        (rightIcon ?? <Icon name={"toggler-caretdown"} small className="shrink-0 opacity-50" />)
                    )}
                </>
            }
            textClassName={text ? "" : "text-muted-foreground"}
            data-test-id={dataTestId ? dataTestId + "_toggler" : undefined}
            data-testid={dataTestid ? dataTestid + "_toggler" : undefined}
        />
    );

    // --- dropdown content --------------------------------------------------------------------------
    const showInitialContentOnly = query === "" && initialContent !== undefined;
    let listContent: React.ReactNode;
    if (showInitialContentOnly) {
        listContent = initialContent; // `null` renders nothing (dropdown only with query)
    } else if (rows.length > 0) {
        listContent = rows.map(({ key, element }) => <React.Fragment key={key}>{element}</React.Fragment>);
    } else {
        listContent = noResults ?? null;
    }

    const selectContent = (
        <PopoverPrimitive.Root open={open}>
            <PopoverPrimitive.Anchor asChild>
                <span
                    ref={targetRef}
                    className={cn(
                        `${eccgui}-select`,
                        fill ? "block w-full" : "inline-block max-w-full",
                        // ported from _select.scss `.eccgui-select .eccgui-button { max-width: 100% }`
                        // (SCSS sunset) — constrains a nested (default or custom) button target.
                        "[&_.eccgui-button]:max-w-full",
                        className,
                    )}
                    onClick={() => {
                        if (!disabled) {
                            setInternalOpen(!open);
                        }
                    }}
                    onKeyDown={filterable ? undefined : handleKeyDown}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    {children ?? defaultTarget}
                </span>
            </PopoverPrimitive.Anchor>
            <ComboboxDropdown
                open={open}
                onCloseRequest={() => closeDropdown()}
                isAnchorInteraction={(target) => !!(target instanceof Node && targetRef.current?.contains(target))}
                overlayProps={overlayProps}
                defaultMatchTargetWidth={fill ?? false}
                contentClassName={`${eccgui}-select__dropdown`}
                contentAttributes={{
                    "data-test-id": dataTestId ? dataTestId + "_drowpdown" : undefined,
                    "data-testid": dataTestid ? dataTestid + "_dropdown" : undefined,
                }}
            >
                {filterable && (
                    <div className={`${eccgui}-select__filter p-1`}>
                        <TextField
                            fill={fill}
                            data-test-id={dataTestId ? dataTestId + "_searchinput" : undefined}
                            data-testid={dataTestid ? dataTestid + "_searchinput" : undefined}
                            placeholder="Filter..."
                            {...(inputProps ?? {})}
                            inputRef={filterInputRef}
                            value={query}
                            onChange={(event) => changeQuery(event.target.value, event)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                )}
                <Menu
                    role="listbox"
                    {...(menuProps ?? {})}
                    ulRef={listRef}
                    className={cn("max-h-[40vh] overflow-auto p-1", menuProps?.className)}
                >
                    {listContent}
                </Menu>
            </ComboboxDropdown>
        </PopoverPrimitive.Root>
    );

    return wrapperProps || dataTestId || dataTestid ? (
        <div
            className={`${eccgui}-select__wrapper`}
            {...(wrapperProps ?? {})}
            {...{ "data-test-id": dataTestId, "data-testid": dataTestid }}
        >
            {selectContent}
        </div>
    ) : (
        <>{selectContent}</>
    );
}

export default Select;
