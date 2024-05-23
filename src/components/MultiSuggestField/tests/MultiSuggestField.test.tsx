import React, { useCallback, useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import { MultiSuggestField } from "../MultiSuggestField";
import { Default, dropdownOnFocus, predefinedNotControlledValues } from "../MultiSuggestField.stories";

const testLabels = ["label1", "label2", "label3", "label4", "label5"];

const items = new Array(5).fill(undefined).map((_, id) => {
    const testLabel = testLabels[id];
    return { testLabel, testId: `${testLabel}-id` };
});

export const TestComponent = (): JSX.Element => {
    const copy: Array<{ testLabel: string; testId: string }> = [items[2]];

    const [selected, setSelected] = useState(copy);

    const handleOnSelect = useCallback((params) => {
        const items = params.selectedItems;
        setSelected(items);
    }, []);

    const handleReset = (): void => {
        setSelected(copy);
    };

    return (
        <div>
            <button data-testid="reset-button" onClick={handleReset}>
                Reset
            </button>
            <br />
            <br />
            <MultiSuggestField<{ testLabel: string; testId: string }>
                items={items}
                createNewItemFromQuery={(query) => ({ testId: `${query}-id`, testLabel: query })}
                onSelection={handleOnSelect}
                itemId={({ testId }) => testId}
                itemLabel={({ testLabel }) => testLabel}
                selectedItems={selected}
            />
        </div>
    );
};

describe("MultiSuggestField", () => {
    describe("uncontrolled", () => {
        it("should render default input", () => {
            const { container } = render(<MultiSuggestField {...Default.args} />);
            const [input] = container.getElementsByClassName("eccgui-multiselect");

            expect(input).toBeInTheDocument();
        });

        it("should render default selected items", async () => {
            const { getByText } = render(<MultiSuggestField {...predefinedNotControlledValues.args} />);

            const [firstSelected, secondSelected]: Array<string> = predefinedNotControlledValues.args.selectedItems.map(
                ({ testLabel }) => testLabel
            );

            await waitFor(() => {
                expect(getByText(firstSelected)).toBeInTheDocument();
                expect(getByText(secondSelected)).toBeInTheDocument();
            });
        });

        it("should clear all selected items on clear button click", async () => {
            const { container } = render(
                <MultiSuggestField {...predefinedNotControlledValues.args} onSelection={undefined} />
            );

            const selectedLength = predefinedNotControlledValues.args.selectedItems.length;

            expect(container.querySelectorAll("[data-tag-index]").length).toBe(selectedLength);

            const clearButton = container.querySelector('[data-test-id="clear-all-items"');

            expect(clearButton).toBeInTheDocument();

            fireEvent.click(clearButton!);

            await waitFor(() => {
                expect(container.querySelectorAll("[data-tag-index]").length).toBe(0);
            });
        });

        it("should filter options and reset them if the query is empty", async () => {
            const { container } = render(<MultiSuggestField {...dropdownOnFocus.args} />);

            const [inputContainer] = container.getElementsByClassName("eccgui-multiselect");
            const [input] = inputContainer.getElementsByTagName("input");

            fireEvent.click(input);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(dropdownOnFocus.args.items.length);
            });

            fireEvent.change(input, { target: { value: "ex" } });

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");

                expect(menuItems.length).toBe(1);

                const noResult = screen.queryByText(dropdownOnFocus.args.noResultText);
                expect(noResult).not.toBeInTheDocument();
            });

            fireEvent.change(input, { target: { value: "ttt" } });

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");

                expect(menuItems.length).toBe(1);

                const noResult = screen.queryByText(dropdownOnFocus.args.noResultText);
                expect(noResult).toBeInTheDocument();
            });

            fireEvent.change(input, { target: { value: "" } });

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(dropdownOnFocus.args.items.length);
            });
        });

        it("should render disable field with selected items", async () => {
            const { container, getByText } = render(
                <MultiSuggestField {...predefinedNotControlledValues.args} disabled />
            );

            const [inputTargetContainer] = container.getElementsByClassName("eccgui-multiselect__target");

            expect(inputTargetContainer.getAttribute("aria-disabled")).toBe("true");

            const [firstSelected, secondSelected]: Array<string> = predefinedNotControlledValues.args.selectedItems.map(
                ({ testLabel }) => testLabel
            );

            await waitFor(() => {
                expect(getByText(firstSelected)).toBeInTheDocument();
                expect(getByText(secondSelected)).toBeInTheDocument();
            });
        });

        it("should set deferred selection correctly when only selected items provided", async () => {
            const args = { ...predefinedNotControlledValues.args, selectedItems: [] };

            const { rerender } = render(<MultiSuggestField {...args} />);

            const [firstSelected, secondSelected]: Array<string> = predefinedNotControlledValues.args.selectedItems.map(
                ({ testLabel }) => testLabel
            );

            await waitFor(() => {
                expect(screen.queryByText(firstSelected)).toBeNull();
                expect(screen.queryByText(secondSelected)).toBeNull();
            });

            rerender(<MultiSuggestField {...predefinedNotControlledValues.args} />);

            await waitFor(() => {
                expect(screen.getByText(firstSelected)).toBeInTheDocument();
                expect(screen.getByText(secondSelected)).toBeInTheDocument();
            });
        });

        it("should render disable field with deferred selected items", async () => {
            const { container, rerender } = render(
                <MultiSuggestField {...predefinedNotControlledValues.args} selectedItems={[]} disabled />
            );

            const [inputTargetContainer] = container.getElementsByClassName("eccgui-multiselect__target");

            expect(inputTargetContainer.getAttribute("aria-disabled")).toBe("true");

            const [firstSelected, secondSelected]: Array<string> = predefinedNotControlledValues.args.selectedItems.map(
                ({ testLabel }) => testLabel
            );

            await waitFor(() => {
                expect(screen.queryByText(firstSelected)).toBeNull();
                expect(screen.queryByText(secondSelected)).toBeNull();
            });

            rerender(<MultiSuggestField {...predefinedNotControlledValues.args} disabled />);

            const [updatedInputTargetContainer] = container.getElementsByClassName("eccgui-multiselect__target");

            expect(updatedInputTargetContainer.getAttribute("aria-disabled")).toBe("true");

            await waitFor(() => {
                expect(screen.getByText(firstSelected)).toBeInTheDocument();
                expect(screen.getByText(secondSelected)).toBeInTheDocument();
            });
        });

        it("should call onSelection function with the selected items", async () => {
            const onSelection = jest.fn();

            const { container } = render(
                <MultiSuggestField {...dropdownOnFocus.args} items={items} onSelection={onSelection} />
            );

            const [inputContainer] = container.getElementsByClassName("eccgui-multiselect");
            const [input] = inputContainer.getElementsByTagName("input");

            fireEvent.click(input);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(dropdownOnFocus.args.items.length);

                const item = menuItems[0];
                fireEvent.click(item);
            });

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    newlySelected: items[0],
                    selectedItems: [items[0]],
                };
                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });
        });
    });

    describe("controlled", () => {
        it("should render default selected items", async () => {
            const onSelection = jest.fn();

            const { getByText } = render(
                <MultiSuggestField {...predefinedNotControlledValues.args} onSelection={onSelection} />
            );

            const [firstSelected, secondSelected]: Array<string> = predefinedNotControlledValues.args.selectedItems.map(
                ({ testLabel }) => testLabel
            );

            await waitFor(() => {
                expect(getByText(firstSelected)).toBeInTheDocument();
                expect(getByText(secondSelected)).toBeInTheDocument();
            });
        });

        it("should call onSelection function with the selected items", async () => {
            const onSelection = jest.fn((values) => {
                console.log("Mocked onSelection function values: ", values);
            });

            const { container } = render(
                <MultiSuggestField {...dropdownOnFocus.args} items={items} onSelection={onSelection} />
            );

            const [inputContainer] = container.getElementsByClassName("eccgui-multiselect");
            const [input] = inputContainer.getElementsByTagName("input");

            fireEvent.click(input);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(dropdownOnFocus.args.items.length);

                const item = menuItems[0];
                fireEvent.click(item);
            });

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    newlySelected: items[0],
                    selectedItems: [items[0]],
                };

                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });
        });

        it("should set deferred selection correctly", async () => {
            const onSelection = jest.fn((values) => {
                console.log("Mocked onSelection function values: ", values);
            });

            const items = predefinedNotControlledValues.args.items;

            const args = { ...predefinedNotControlledValues.args, selectedItems: [], onSelection: onSelection };

            const { container, rerender } = render(<MultiSuggestField {...args} />);

            const [inputContainer] = container.getElementsByClassName("eccgui-multiselect");
            const [input] = inputContainer.getElementsByTagName("input");

            fireEvent.click(input);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(predefinedNotControlledValues.args.items.length);

                const item = menuItems[0];
                fireEvent.click(item);
            });

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    newlySelected: items[0],
                    selectedItems: [items[0]],
                };
                expect(onSelection).toHaveBeenCalledTimes(1);
                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });

            const selectedItems = items.slice(2);

            rerender(<MultiSuggestField {...args} selectedItems={selectedItems} />);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(predefinedNotControlledValues.args.items.length);

                const item = menuItems[0];
                fireEvent.click(item);
            });

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    newlySelected: items[0],
                    selectedItems: [...selectedItems, items[0]],
                };

                expect(onSelection).toHaveBeenCalledTimes(2);
                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });
        });
    });
});
