import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";

import { MenuItem, MultiSuggestField, MultiSuggestFieldSelectionProps } from "../../../../index";

interface Option {
    id: string;
    label: string;
}

const itemId = (item: Option) => item.id;
const itemLabel = (item: Option) => item.label;
const createItem = (query: string): Option => ({ id: query, label: query });
const requestDelay = 200;

const deferredOptions = () => {
    let resolve!: (items: Option[]) => void;
    const promise = new Promise<Option[]>((resolvePromise) => {
        resolve = resolvePromise;
    });
    return { promise, resolve };
};

const advanceTime = async (milliseconds = requestDelay) => {
    await act(async () => {
        jest.advanceTimersByTime(milliseconds);
    });
};

describe("MultiSuggestField regressions", () => {
    beforeEach(() => jest.useFakeTimers());

    afterEach(() => {
        act(() => jest.runOnlyPendingTimers());
        jest.useRealTimers();
    });

    it("shows created options once when the parent feeds selected values back as items", async () => {
        const SelectionField = () => {
            const [selected, setSelected] = React.useState<Option[]>([]);
            const onSelection = React.useCallback(({ selectedItems }: MultiSuggestFieldSelectionProps<Option>) => {
                setSelected(selectedItems);
            }, []);
            return (
                <MultiSuggestField
                    items={selected}
                    selectedItems={selected}
                    onSelection={onSelection}
                    itemId={itemId}
                    itemLabel={itemLabel}
                    createNewItemFromQuery={createItem}
                    runOnQueryChange={() => []}
                    requestDelay={requestDelay}
                    openOnKeyDown
                />
            );
        };
        render(<SelectionField />);
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const input = screen.getByRole("combobox");
        await user.click(input);

        for (const label of ["urn:root:type", "urn:event:type"]) {
            await user.type(input, label);
            await advanceTime();
            expect(screen.getByRole("option", { name: `Add new item '${label}'` })).toBeInTheDocument();
            await user.keyboard("{Enter}");
            expect(input).toHaveValue("");
        }

        const listbox = screen.getByRole("listbox");
        expect(within(listbox).getAllByRole("option", { name: "urn:root:type" })).toHaveLength(1);
        expect(within(listbox).getAllByRole("option", { name: "urn:event:type" })).toHaveLength(1);

        await user.click(screen.getByRole("button", { name: "Removing tag 'urn:root:type'" }));
        expect(within(listbox).getByRole("option", { name: "urn:root:type" })).toHaveAttribute(
            "aria-selected",
            "false",
        );
        await user.click(within(listbox).getByRole("option", { name: "urn:root:type" }).querySelector("a")!);
        expect(within(listbox).getAllByRole("option", { name: "urn:root:type" })).toHaveLength(1);
        expect(within(listbox).getByRole("option", { name: "urn:root:type" })).toHaveAttribute("aria-selected", "true");
    });

    it("merges remote results with created options without repeating the same ID", async () => {
        const existing = { id: "urn:root:type", label: "urn:root:type" };
        const queryResults = jest
            .fn<Promise<Option[]>, [string]>()
            .mockResolvedValueOnce([])
            .mockResolvedValue([existing]);
        render(
            <MultiSuggestField
                items={[]}
                itemId={itemId}
                itemLabel={itemLabel}
                createNewItemFromQuery={createItem}
                runOnQueryChange={queryResults}
                requestDelay={requestDelay}
                openOnKeyDown
            />,
        );
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const input = screen.getByRole("combobox");
        await user.click(input);
        await user.type(input, existing.label);
        await advanceTime();
        await user.keyboard("{Enter}");
        await user.type(input, "root");
        await advanceTime();

        expect(queryResults).toHaveBeenLastCalledWith("root");
        expect(within(screen.getByRole("listbox")).getAllByRole("option", { name: existing.label })).toHaveLength(1);
    });

    it("refreshes externally supplied options while a query callback returns no results of its own", async () => {
        const initial = { id: "alpha-1", label: "Alpha first" };
        const added = { id: "alpha-2", label: "Alpha second" };
        const nonMatching = { id: "beta", label: "Beta" };
        const props = {
            itemId,
            itemLabel,
            runOnQueryChange: jest.fn(() => undefined),
            requestDelay,
            openOnKeyDown: true,
        };
        const { rerender } = render(<MultiSuggestField {...props} items={[initial, nonMatching]} />);
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const input = screen.getByRole("combobox");
        await user.click(input);
        await user.type(input, "Alpha");
        await advanceTime();
        expect(screen.getByRole("option", { name: initial.label })).toBeInTheDocument();

        rerender(<MultiSuggestField {...props} items={[initial, added, nonMatching]} />);

        expect(input).toHaveValue("Alpha");
        expect(screen.getByRole("option", { name: added.label })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: nonMatching.label })).not.toBeInTheDocument();
    });

    it("does not classify an existing selected ID as newly created when it is absent from the filtered results", async () => {
        const existing = { id: "urn:root:type", label: "Root type" };
        const onSelection = jest.fn<void, [MultiSuggestFieldSelectionProps<Option>]>();
        render(
            <MultiSuggestField
                items={[existing]}
                selectedItems={[existing]}
                onSelection={onSelection}
                itemId={itemId}
                itemLabel={itemLabel}
                createNewItemFromQuery={createItem}
                runOnQueryChange={() => []}
                requestDelay={requestDelay}
                openOnKeyDown
            />,
        );
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const input = screen.getByRole("combobox");
        await user.click(input);
        await user.type(input, existing.id);
        await advanceTime();
        onSelection.mockClear();
        await user.keyboard("{Enter}");

        expect(onSelection).toHaveBeenLastCalledWith(
            expect.objectContaining({ newlyRemoved: existing, selectedItems: [], createdItems: [] }),
        );
        expect(input).toHaveValue(existing.id);
    });

    it.each(["(2 classes, 3 properties)", "property count: 3"])(
        "includes supplementary vocabulary information '%s' in the option's accessible name",
        async (details) => {
            const vocabulary = { id: "urn:vocabulary", label: "Example vocabulary" };
            render(
                <MultiSuggestField
                    items={[vocabulary]}
                    itemId={itemId}
                    itemLabel={itemLabel}
                    openOnKeyDown
                    itemRenderer={(item, { modifiers, handleClick }) => (
                        <MenuItem
                            roleStructure="listoption"
                            text={item.label}
                            label={details}
                            active={modifiers.active}
                            onClick={handleClick}
                            shouldDismissPopover={false}
                        />
                    )}
                />,
            );
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            await user.click(screen.getByRole("combobox"));
            await user.keyboard("{Enter}{ArrowDown}");

            const option = within(screen.getByRole("listbox")).getByRole("option");
            expect(option).toHaveTextContent(details);
            expect(option).toHaveAccessibleName(`${vocabulary.label} ${details}`);
            expect(screen.getByRole("combobox")).toHaveAttribute("aria-activedescendant", option.id);
        },
    );

    it("stops loading and cancels the scheduled search when the query is cleared before the debounce expires", async () => {
        const queryResults = jest.fn(() => []);
        render(
            <MultiSuggestField
                items={[]}
                itemId={itemId}
                itemLabel={itemLabel}
                runOnQueryChange={queryResults}
                requestDelay={requestDelay}
                openOnKeyDown
            />,
        );
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const input = screen.getByRole("combobox");
        await user.click(input);
        await user.type(input, "root");
        expect(screen.getByRole("progressbar", { name: "loading" })).toBeInTheDocument();
        expect(queryResults).not.toHaveBeenCalled();
        await user.clear(input);

        expect(input).toHaveValue("");
        expect(screen.queryByRole("progressbar", { name: "loading" })).not.toBeInTheDocument();
        await advanceTime();
        expect(queryResults).not.toHaveBeenCalled();
    });

    it("stops loading after clearing an in-flight query and ignores its late result", async () => {
        const pending = deferredOptions();
        const initial = { id: "initial", label: "Initial option" };
        const late = { id: "late", label: "Late search result" };
        const queryResults = jest.fn(() => pending.promise);
        render(
            <MultiSuggestField
                items={[initial]}
                itemId={itemId}
                itemLabel={itemLabel}
                runOnQueryChange={queryResults}
                requestDelay={requestDelay}
                openOnKeyDown
            />,
        );
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const input = screen.getByRole("combobox");
        await user.click(input);
        await user.type(input, "root");
        await advanceTime();
        expect(queryResults).toHaveBeenCalledWith("root");
        expect(screen.getByRole("progressbar", { name: "loading" })).toBeInTheDocument();
        await user.clear(input);

        expect(screen.queryByRole("progressbar", { name: "loading" })).not.toBeInTheDocument();
        await act(async () => pending.resolve([late]));
        await user.keyboard("{ArrowDown}");

        expect(screen.getByRole("listbox")).toBeInTheDocument();
        expect(input).toHaveValue("");
        expect(screen.queryByRole("progressbar", { name: "loading" })).not.toBeInTheDocument();
        expect(screen.queryByRole("option", { name: late.label })).not.toBeInTheDocument();
    });

    it("keeps a newer query loading when a cleared query finishes", async () => {
        const oldRequest = deferredOptions();
        const newRequest = deferredOptions();
        const queryResults = jest.fn(() => newRequest.promise).mockReturnValueOnce(oldRequest.promise);
        render(
            <MultiSuggestField
                items={[]}
                itemId={itemId}
                itemLabel={itemLabel}
                runOnQueryChange={queryResults}
                requestDelay={requestDelay}
                openOnKeyDown
            />,
        );
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const input = screen.getByRole("combobox");
        await user.click(input);
        fireEvent.change(input, { target: { value: "old" } });
        await advanceTime();
        await user.clear(input);
        fireEvent.change(input, { target: { value: "new" } });
        await advanceTime();
        expect(queryResults.mock.calls).toHaveLength(2);

        await act(async () => oldRequest.resolve([{ id: "old", label: "Old result" }]));
        expect(screen.getByRole("progressbar", { name: "loading" })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: "Old result" })).not.toBeInTheDocument();
        await act(async () => newRequest.resolve([{ id: "new", label: "New result" }]));
        expect(screen.queryByRole("progressbar", { name: "loading" })).not.toBeInTheDocument();
        expect(screen.getByRole("option", { name: "New result" })).toBeInTheDocument();
    });
});
