import React from "react";
import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";

import { MenuItem, Select, SelectProps, SuggestField, SuggestFieldProps, suggestFieldUtils } from "@/index";

import "@testing-library/jest-dom";

import {
    ComboboxItemRendererProps,
    executeItemsEqual,
    placementToRadix,
    scrollActiveRowIntoView,
    useActiveRow,
} from "../internalComboboxParts";

// ---------------------------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------------------------

/** All rendered option rows of the (single) open listbox. */
const menuItems = () => Array.from(screen.getByRole("listbox").getElementsByClassName("eccgui-menu__item"));
const menuItemTexts = () => menuItems().map((item) => item.textContent);

describe("combobox engine", () => {
    // -----------------------------------------------------------------------------------------
    // Select
    // -----------------------------------------------------------------------------------------
    describe("Select", () => {
        interface Fruit {
            id: string;
            label: string;
            banned?: boolean;
        }

        const fruits: Fruit[] = [
            { id: "apple", label: "Apple" },
            { id: "banana", label: "Banana" },
            { id: "cherry", label: "Cherry" },
        ];

        const fruitPredicate = (query: string, item: Fruit) => item.label.toLowerCase().includes(query.toLowerCase());

        const fruitRenderer = (item: Fruit, { handleClick, modifiers }: ComboboxItemRendererProps) => (
            <MenuItem
                key={item.id}
                text={item.label}
                onClick={handleClick}
                active={modifiers.active}
                disabled={modifiers.disabled}
            />
        );

        const renderSelect = (props: Partial<SelectProps<Fruit>> = {}) => {
            const onItemSelect = jest.fn();
            const rendered = render(
                <Select<Fruit>
                    items={fruits}
                    itemRenderer={fruitRenderer}
                    onItemSelect={onItemSelect}
                    itemPredicate={fruitPredicate}
                    noResults={<MenuItem text="No results." disabled />}
                    {...props}
                />,
            );
            return { onItemSelect, ...rendered };
        };

        const openSelect = (container: HTMLElement) => {
            fireEvent.click(container.getElementsByClassName("eccgui-select")[0]);
        };

        const openAndWaitForListbox = async (container: HTMLElement) => {
            openSelect(container);
            await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
        };

        const filterInput = () => screen.getByPlaceholderText("Filter...") as HTMLInputElement;

        const createNewItemProps: Partial<SelectProps<Fruit>> = {
            createNewItemFromQuery: (query) => ({ id: query, label: query }),
            createNewItemRenderer: (query, active, handleClick) => (
                <MenuItem key="create" text={`Create "${query}"`} onClick={handleClick} active={active} />
            ),
        };

        it("opens on target click and filters items via itemPredicate, showing noResults for no match", async () => {
            const { container } = renderSelect();
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

            await openAndWaitForListbox(container);
            expect(menuItemTexts()).toEqual(["Apple", "Banana", "Cherry"]);

            fireEvent.change(filterInput(), { target: { value: "an" } });
            await waitFor(() => expect(menuItemTexts()).toEqual(["Banana"]));

            fireEvent.change(filterInput(), { target: { value: "zzz" } });
            await waitFor(() => expect(menuItemTexts()).toEqual(["No results."]));

            fireEvent.change(filterInput(), { target: { value: "" } });
            await waitFor(() => expect(menuItemTexts()).toEqual(["Apple", "Banana", "Cherry"]));
        });

        it("prefers itemListPredicate over itemPredicate for filtering", async () => {
            const itemListPredicate = jest.fn((_query: string, items: Fruit[]) =>
                items.filter((item) => item.id === "cherry"),
            );
            const itemPredicate = jest.fn(fruitPredicate);
            const { container } = renderSelect({ itemListPredicate, itemPredicate });

            await openAndWaitForListbox(container);
            expect(menuItemTexts()).toEqual(["Cherry"]);
            expect(itemListPredicate).toHaveBeenCalledWith("", fruits);
            expect(itemPredicate).not.toHaveBeenCalled();
        });

        it("moves the active row with ArrowDown and selects it with Enter", async () => {
            const { container, onItemSelect } = renderSelect();
            await openAndWaitForListbox(container);

            // The first row is initially active.
            expect(menuItems()[0]).toHaveClass("eccgui-menu__item--active");

            fireEvent.keyDown(filterInput(), { key: "ArrowDown" });
            expect(menuItems()[1]).toHaveClass("eccgui-menu__item--active");

            fireEvent.keyDown(filterInput(), { key: "Enter" });
            expect(onItemSelect).toHaveBeenCalledTimes(1);
            expect(onItemSelect.mock.calls[0][0]).toBe(fruits[1]);
            await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        });

        it("wraps around to the last row with ArrowUp", async () => {
            const { container, onItemSelect } = renderSelect();
            await openAndWaitForListbox(container);

            fireEvent.keyDown(filterInput(), { key: "ArrowUp" });
            fireEvent.keyDown(filterInput(), { key: "Enter" });
            expect(onItemSelect.mock.calls[0][0]).toBe(fruits[2]);
        });

        it("skips disabled items (itemDisabled callback) in keyboard navigation and ignores clicks on them", async () => {
            const { container, onItemSelect } = renderSelect({
                itemDisabled: (item) => item.id === "banana",
            });
            await openAndWaitForListbox(container);

            // Clicking the disabled row must not select it.
            expect(menuItems()[1]).toHaveAttribute("aria-disabled", "true");
            fireEvent.click(menuItems()[1]);
            expect(onItemSelect).not.toHaveBeenCalled();

            // ArrowDown skips the disabled second row and lands on the third.
            fireEvent.keyDown(filterInput(), { key: "ArrowDown" });
            fireEvent.keyDown(filterInput(), { key: "Enter" });
            expect(onItemSelect).toHaveBeenCalledTimes(1);
            expect(onItemSelect.mock.calls[0][0]).toBe(fruits[2]);
        });

        it("supports itemDisabled given as a property name", async () => {
            const bannedFruits: Fruit[] = [
                { id: "apple", label: "Apple" },
                { id: "banana", label: "Banana", banned: true },
                { id: "cherry", label: "Cherry" },
            ];
            const { container, onItemSelect } = renderSelect({ items: bannedFruits, itemDisabled: "banned" });
            await openAndWaitForListbox(container);

            fireEvent.keyDown(filterInput(), { key: "ArrowDown" });
            fireEvent.keyDown(filterInput(), { key: "Enter" });
            expect(onItemSelect.mock.calls[0][0]).toBe(bannedFruits[2]);
        });

        it("shows the create-new-item row first (default) and creates the item on Enter", async () => {
            const { container, onItemSelect } = renderSelect(createNewItemProps);
            await openAndWaitForListbox(container);

            fireEvent.change(filterInput(), { target: { value: "an" } });
            await waitFor(() => expect(menuItemTexts()).toEqual(['Create "an"', "Banana"]));

            // After the query change the active row is reset to the first row: the create option.
            fireEvent.keyDown(filterInput(), { key: "Enter" });
            expect(onItemSelect).toHaveBeenCalledTimes(1);
            expect(onItemSelect.mock.calls[0][0]).toEqual({ id: "an", label: "an" });
            await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        });

        it("shows the create-new-item row last with createNewItemPosition='last' and creates it on click", async () => {
            const { container, onItemSelect } = renderSelect({
                ...createNewItemProps,
                createNewItemPosition: "last",
            });
            await openAndWaitForListbox(container);

            fireEvent.change(filterInput(), { target: { value: "an" } });
            await waitFor(() => expect(menuItemTexts()).toEqual(["Banana", 'Create "an"']));

            fireEvent.click(menuItems()[1]);
            expect(onItemSelect.mock.calls[0][0]).toEqual({ id: "an", label: "an" });
        });

        it("suppresses the create-new-item row for existing items when itemsEqual is a property name", async () => {
            const { container } = renderSelect({ ...createNewItemProps, itemsEqual: "id" });
            await openAndWaitForListbox(container);

            // "apple" equals an existing item by its `id` property: no create row.
            fireEvent.change(filterInput(), { target: { value: "apple" } });
            await waitFor(() => expect(menuItemTexts()).toEqual(["Apple"]));

            // "appl" does not equal any existing id: create row appears.
            fireEvent.change(filterInput(), { target: { value: "appl" } });
            await waitFor(() => expect(menuItemTexts()).toEqual(['Create "appl"', "Apple"]));
        });

        it("resets the query on selection with resetOnSelect", async () => {
            const onQueryChange = jest.fn();
            const { container, onItemSelect } = renderSelect({ resetOnSelect: true, onQueryChange });
            await openAndWaitForListbox(container);

            fireEvent.change(filterInput(), { target: { value: "an" } });
            await waitFor(() => expect(menuItemTexts()).toEqual(["Banana"]));

            fireEvent.click(menuItems()[0]);
            expect(onItemSelect.mock.calls[0][0]).toBe(fruits[1]);
            expect(onQueryChange).toHaveBeenLastCalledWith("", undefined);

            await openAndWaitForListbox(container);
            expect(filterInput().value).toBe("");
            expect(menuItemTexts()).toEqual(["Apple", "Banana", "Cherry"]);
        });

        it("keeps the query over close/reopen by default", async () => {
            const { container } = renderSelect();
            await openAndWaitForListbox(container);

            fireEvent.change(filterInput(), { target: { value: "an" } });
            fireEvent.keyDown(filterInput(), { key: "Escape" });
            await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());

            await openAndWaitForListbox(container);
            expect(filterInput().value).toBe("an");
            expect(menuItemTexts()).toEqual(["Banana"]);
        });

        it("clears the query when the dropdown closes with resetOnClose", async () => {
            const { container } = renderSelect({ resetOnClose: true });
            await openAndWaitForListbox(container);

            fireEvent.change(filterInput(), { target: { value: "an" } });
            fireEvent.keyDown(filterInput(), { key: "Escape" });
            await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());

            await openAndWaitForListbox(container);
            expect(filterInput().value).toBe("");
            expect(menuItemTexts()).toEqual(["Apple", "Banana", "Cherry"]);
        });

        const aItems: Fruit[] = [
            { id: "alpha", label: "alpha" },
            { id: "arch", label: "arch" },
            { id: "atom", label: "atom" },
        ];

        it("resets the active row when the query changes (resetOnQuery default)", async () => {
            const { container, onItemSelect } = renderSelect({ items: aItems });
            await openAndWaitForListbox(container);

            fireEvent.keyDown(filterInput(), { key: "ArrowDown" });
            expect(menuItems()[1]).toHaveClass("eccgui-menu__item--active");

            // All three items still match "a", but the active row is reset to the first one.
            fireEvent.change(filterInput(), { target: { value: "a" } });
            fireEvent.keyDown(filterInput(), { key: "Enter" });
            expect(onItemSelect.mock.calls[0][0]).toBe(aItems[0]);
        });

        it("keeps the active row on query changes with resetOnQuery={false}", async () => {
            const { container, onItemSelect } = renderSelect({ items: aItems, resetOnQuery: false });
            await openAndWaitForListbox(container);

            fireEvent.keyDown(filterInput(), { key: "ArrowDown" });
            fireEvent.change(filterInput(), { target: { value: "a" } });
            fireEvent.keyDown(filterInput(), { key: "Enter" });
            expect(onItemSelect.mock.calls[0][0]).toBe(aItems[1]);
        });

        it("notifies about active item changes via onActiveItemChange", async () => {
            const onActiveItemChange = jest.fn();
            const { container } = renderSelect({ onActiveItemChange });

            await waitFor(() => expect(onActiveItemChange).toHaveBeenLastCalledWith(fruits[0], false));

            await openAndWaitForListbox(container);
            fireEvent.keyDown(filterInput(), { key: "ArrowDown" });
            await waitFor(() => expect(onActiveItemChange).toHaveBeenLastCalledWith(fruits[1], false));
        });

        it("shows initialContent instead of the item list while the query is empty", async () => {
            const { container } = renderSelect({
                initialContent: <MenuItem text="Type to search" disabled />,
            });
            await openAndWaitForListbox(container);

            expect(menuItemTexts()).toEqual(["Type to search"]);

            fireEvent.change(filterInput(), { target: { value: "an" } });
            await waitFor(() => expect(menuItemTexts()).toEqual(["Banana"]));

            fireEvent.change(filterInput(), { target: { value: "" } });
            await waitFor(() => expect(menuItemTexts()).toEqual(["Type to search"]));
        });
    });

    // -----------------------------------------------------------------------------------------
    // SuggestField
    // -----------------------------------------------------------------------------------------
    describe("SuggestField", () => {
        const suggestItems = ["apple pie", "banana split", "cherry cake"];

        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.clearAllTimers();
            jest.useRealTimers();
        });

        const renderSuggest = (props: Partial<SuggestFieldProps<string, string>> = {}) => {
            const onChange = jest.fn();
            const onSearch = jest.fn((query: string) => suggestItems.filter((item) => item.includes(query)));
            const rendered = render(
                <SuggestField<string, string>
                    onSearch={onSearch}
                    onChange={onChange}
                    itemRenderer={(item) => `Item: ${item}`}
                    itemValueRenderer={(item) => `Label: ${item}`}
                    itemValueString={(item) => item}
                    itemValueSelector={(item) => `value:${item}`}
                    noResultText="nothing found"
                    {...props}
                />,
            );
            const input = rendered.container.getElementsByTagName("input")[0] as HTMLInputElement;
            return { onChange, onSearch, input, ...rendered };
        };

        /** Advances the (fake) debounce timer and flushes the async search resolution. */
        const flushSearch = async (ms = 200) => {
            await act(async () => {
                jest.advanceTimersByTime(ms);
            });
        };

        it("debounces onSearch and only queries with the latest input", async () => {
            const { onSearch, input } = renderSuggest();

            fireEvent.focus(input);
            expect(onSearch).not.toHaveBeenCalled();
            await flushSearch(199);
            expect(onSearch).not.toHaveBeenCalled();
            await flushSearch(1);
            expect(onSearch).toHaveBeenCalledTimes(1);
            expect(onSearch).toHaveBeenLastCalledWith("");

            onSearch.mockClear();
            fireEvent.change(input, { target: { value: "a" } });
            await flushSearch(100);
            // Typing again within the debounce window restarts the timer.
            fireEvent.change(input, { target: { value: "ap" } });
            await flushSearch(100);
            expect(onSearch).not.toHaveBeenCalled();
            await flushSearch(100);
            expect(onSearch).toHaveBeenCalledTimes(1);
            expect(onSearch).toHaveBeenLastCalledWith("ap");
        });

        it("selects an item on click: onChange gets the itemValueSelector value, the input shows the itemValueRenderer text", async () => {
            const { onChange, input } = renderSuggest();

            fireEvent.focus(input);
            await flushSearch();
            expect(menuItemTexts()).toEqual(["Item: apple pie", "Item: banana split", "Item: cherry cake"]);

            fireEvent.click(menuItems()[0]);
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith("value:apple pie", expect.anything());
            // While still focused the query is reset to the selected item's rendered value.
            expect(input.value).toBe("Label: apple pie");
            await act(async () => {});
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

            fireEvent.blur(input);
            expect(input.value).toBe("Label: apple pie");
        });

        it("selects the active row via ArrowDown + Enter", async () => {
            const { onChange, input } = renderSuggest();

            fireEvent.focus(input);
            await flushSearch();
            fireEvent.keyDown(input, { key: "ArrowDown" });
            fireEvent.keyDown(input, { key: "Enter" });
            expect(onChange).toHaveBeenCalledWith("value:banana split", expect.anything());
        });

        it("renders a clear button for resettable values and resets to reset.resetValue", async () => {
            const { onChange, container, input } = renderSuggest({
                initialValue: "banana split",
                reset: {
                    resettableValue: () => true,
                    resetValue: "value:RESET",
                    resetButtonText: "Clear value",
                },
            });

            expect(input.value).toBe("Label: banana split");
            const clearButton = container.querySelector("[data-test-id='auto-complete-clear-btn']");
            expect(clearButton).toBeInTheDocument();

            fireEvent.click(clearButton!);
            expect(onChange).toHaveBeenCalledWith("value:RESET");
            expect(input.value).toBe("");
        });

        it("does not render a clear button when the value is not resettable", () => {
            const { container } = renderSuggest({
                initialValue: "banana split",
                reset: {
                    resettableValue: () => false,
                    resetValue: "value:RESET",
                    resetButtonText: "Clear value",
                },
            });
            expect(container.querySelector("[data-test-id='auto-complete-clear-btn']")).not.toBeInTheDocument();
        });

        it("gates the dropdown behind a non-empty query with onlyDropdownWithQuery", async () => {
            const { input } = renderSuggest({ onlyDropdownWithQuery: true });

            fireEvent.focus(input);
            await flushSearch();
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

            fireEvent.change(input, { target: { value: "app" } });
            await flushSearch();
            expect(menuItemTexts()).toEqual(["Item: apple pie"]);

            fireEvent.change(input, { target: { value: "" } });
            await act(async () => {});
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });

        it("restores the query to the selected value when Escape closes the dropdown", async () => {
            const { input } = renderSuggest({ initialValue: "apple pie" });

            fireEvent.focus(input);
            expect(input.value).toBe("Label: apple pie");

            fireEvent.change(input, { target: { value: "junk" } });
            expect(input.value).toBe("junk");

            fireEvent.keyDown(input, { key: "Escape" });
            await act(async () => {});
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
            expect(input.value).toBe("Label: apple pie");
        });

        it("restores the selected value display on blur", async () => {
            const { input } = renderSuggest({ initialValue: "cherry cake" });

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: "junk" } });
            fireEvent.blur(input);
            await act(async () => {});

            expect(input.value).toBe("Label: cherry cake");
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });

        it("offers creating a new item for novel queries but not for existing result values", async () => {
            const { onChange, input } = renderSuggest({
                createNewItem: {
                    itemFromQuery: (query) => query,
                    itemRenderer: suggestFieldUtils.createNewItemRendererFactory((query) => `Create: ${query}`),
                },
            });

            fireEvent.focus(input);
            // An existing item with the same value suppresses the create option.
            fireEvent.change(input, { target: { value: "apple pie" } });
            await flushSearch();
            expect(menuItemTexts()).toEqual(["Item: apple pie"]);

            fireEvent.change(input, { target: { value: "brand new" } });
            await flushSearch();
            expect(menuItemTexts()).toEqual(["Create: brand new"]);

            fireEvent.click(menuItems()[0]);
            expect(onChange).toHaveBeenCalledWith("value:brand new", expect.anything());
        });

        it("shows a request error notification with the configured prefix", async () => {
            const failingSearch = jest.fn((): string[] => {
                throw new Error("boom");
            });
            const { input } = renderSuggest({ onSearch: failingSearch, requestErrorPrefix: "Search failed: " });

            fireEvent.focus(input);
            await flushSearch();
            expect(screen.getByText("Search failed: boom")).toBeInTheDocument();
        });
    });

    // -----------------------------------------------------------------------------------------
    // internalComboboxParts (pure units)
    // -----------------------------------------------------------------------------------------
    describe("internalComboboxParts", () => {
        describe("executeItemsEqual", () => {
            it("falls back to strict equality without an itemsEqual prop", () => {
                const item = { id: 1 };
                expect(executeItemsEqual(undefined, item, item)).toBe(true);
                expect(executeItemsEqual(undefined, { id: 1 }, { id: 1 })).toBe(false);
            });

            it("uses a comparator function", () => {
                const comparator = jest.fn((a: string, b: string) => a.toLowerCase() === b.toLowerCase());
                expect(executeItemsEqual(comparator, "Apple", "apple")).toBe(true);
                expect(executeItemsEqual(comparator, "Apple", "pear")).toBe(false);
                expect(comparator).toHaveBeenCalledTimes(2);
            });

            it("compares by property when given a property name", () => {
                type Item = { id: string; label?: string };
                expect(executeItemsEqual<Item>("id", { id: "a", label: "x" }, { id: "a", label: "y" })).toBe(true);
                expect(executeItemsEqual<Item>("id", { id: "a" }, { id: "b" })).toBe(false);
            });

            it("handles null/undefined operands without calling the comparator", () => {
                const comparator = jest.fn(() => true);
                expect(executeItemsEqual<string>(comparator, null, null)).toBe(true);
                expect(executeItemsEqual<string>(comparator, undefined, undefined)).toBe(true);
                expect(executeItemsEqual<string>(comparator, null, undefined)).toBe(false);
                expect(executeItemsEqual<string>(comparator, "a", null)).toBe(false);
                expect(executeItemsEqual<string>(comparator, undefined, "b")).toBe(false);
                expect(comparator).not.toHaveBeenCalled();
            });
        });

        it("placementToRadix maps Blueprint placement strings to Radix side/align", () => {
            expect(placementToRadix(undefined)).toEqual({ side: "bottom", align: "start" });
            expect(placementToRadix("bottom-start")).toEqual({ side: "bottom", align: "start" });
            expect(placementToRadix("top")).toEqual({ side: "top", align: "start" });
            expect(placementToRadix("left-end")).toEqual({ side: "left", align: "end" });
            // Unknown side falls back to "bottom".
            expect(placementToRadix("auto")).toEqual({ side: "bottom", align: "start" });
        });

        describe("useActiveRow", () => {
            const rows = [{ key: "a" }, { key: "b", disabled: true }, { key: "c" }];

            it("starts at the first enabled row and skips disabled rows with wrap-around", () => {
                const { result } = renderHook((props: { rows: typeof rows }) => useActiveRow(props.rows), {
                    initialProps: { rows },
                });
                expect(result.current.activeKey).toBe("a");

                act(() => result.current.moveActive(1));
                expect(result.current.activeKey).toBe("c");

                act(() => result.current.moveActive(1));
                expect(result.current.activeKey).toBe("a");

                act(() => result.current.moveActive(-1));
                expect(result.current.activeKey).toBe("c");
            });

            it("falls back to the first enabled row when the active key disappears", () => {
                const { result, rerender } = renderHook((props: { rows: typeof rows }) => useActiveRow(props.rows), {
                    initialProps: { rows },
                });
                act(() => result.current.moveActive(1));
                expect(result.current.activeKey).toBe("c");

                rerender({ rows: [{ key: "a" }, { key: "b" }] });
                expect(result.current.activeKey).toBe("a");
            });

            it("treats a row that became disabled as no longer active", () => {
                const { result, rerender } = renderHook((props: { rows: typeof rows }) => useActiveRow(props.rows), {
                    initialProps: { rows },
                });
                act(() => result.current.moveActive(1));
                expect(result.current.activeKey).toBe("c");

                rerender({ rows: [{ key: "a" }, { key: "c", disabled: true }] });
                expect(result.current.activeKey).toBe("a");
            });

            it("resetActive returns to the first enabled row", () => {
                const { result } = renderHook((props: { rows: typeof rows }) => useActiveRow(props.rows), {
                    initialProps: { rows },
                });
                act(() => result.current.moveActive(1));
                expect(result.current.activeKey).toBe("c");

                act(() => result.current.resetActive());
                expect(result.current.activeKey).toBe("a");
            });
        });

        it("scrollActiveRowIntoView scrolls the active menu row into view", () => {
            const list = document.createElement("ul");
            const inactive = document.createElement("li");
            inactive.className = "eccgui-menu__item";
            const active = document.createElement("li");
            active.className = "eccgui-menu__item eccgui-menu__item--active";
            active.scrollIntoView = jest.fn();
            list.appendChild(inactive);
            list.appendChild(active);

            scrollActiveRowIntoView(list);
            expect(active.scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });

            expect(() => scrollActiveRowIntoView(null)).not.toThrow();
        });
    });
});
