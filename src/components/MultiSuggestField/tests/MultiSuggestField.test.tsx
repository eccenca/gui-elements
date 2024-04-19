import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import { MultiSuggestField } from "../MultiSuggestField";
import {
    Default,
    dropdownOnFocus,
    predefinedNotControlledValues,
    withResetItemAndCreation,
} from "../MultiSuggestField.stories";

import { items, TestComponent } from "./constants";

describe("MultiSuggestField", () => {
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

    it("should clear all selected items on clear button click for uncontrolled field", async () => {
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
        const { container } = render(<MultiSuggestField {...predefinedNotControlledValues.args} disabled />);

        const [inputTargetContainer] = container.getElementsByClassName("eccgui-multiselect__target");

        expect(inputTargetContainer.getAttribute("aria-disabled")).toBe("true");
    });

    it("should call onSelection function with the selected items for the contolled field", async () => {
        const onSelection = jest.fn();

        const { container } = render(<MultiSuggestField {...dropdownOnFocus.args} onSelection={onSelection} />);

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

    it("should reset values correctly with the pre-defined values for the contolled field", async () => {
        const { container, getByTestId } = render(<TestComponent />);

        const [inputContainer] = container.getElementsByClassName("eccgui-multiselect");
        const [input] = inputContainer.getElementsByTagName("input");

        fireEvent.click(input);

        await waitFor(() => {
            const listbox = screen.getByRole("listbox");
            expect(listbox).toBeInTheDocument();

            const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
            expect(menuItems.length).toBe(dropdownOnFocus.args.items.length);

            const selectedItems = inputContainer.querySelectorAll("[data-tag-index]");
            expect(selectedItems.length).toBe(1);

            const item = menuItems[0];
            fireEvent.click(item);

            const otherItem = menuItems[menuItems.length - 1];
            fireEvent.click(otherItem);

            const selectedItemsAfterSelection = inputContainer.querySelectorAll("[data-tag-index]");

            expect(selectedItemsAfterSelection.length).toBe(3);

            const resetButton = getByTestId("reset-button");
            expect(resetButton).toBeInTheDocument();

            fireEvent.click(resetButton);
        });

        await waitFor(() => {
            const selectedItemsAfterReset = inputContainer.querySelectorAll("[data-tag-index]");
            expect(selectedItemsAfterReset.length).toBe(1);
        });
    });
});
