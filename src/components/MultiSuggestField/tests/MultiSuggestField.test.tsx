import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import { MultiSuggestField } from "../MultiSuggestField";
import { Default, dropdownOnFocus, predefinedValues } from "../MultiSuggestField.stories";

describe("MultiSuggestField", () => {
    it("should render default input", () => {
        const { container } = render(<MultiSuggestField {...Default.args} />);
        const [input] = container.getElementsByClassName("eccgui-multiselect");

        expect(input).toBeInTheDocument();
    });

    it("should render default selected items", async () => {
        const { getByTestId } = render(<MultiSuggestField {...predefinedValues.args} />);

        const [firstSelected, secondSelected]: Array<string> = predefinedValues.args.selectedItems.map(
            ({ testLabel }) => testLabel.trim()
        );

        await waitFor(() => {
            expect(getByTestId(firstSelected)).toBeInTheDocument();
            expect(getByTestId(secondSelected)).toBeInTheDocument();
        });
    });

    it("should clear all selected items on clear button click", async () => {
        const { queryByTestId, getByTestId } = render(<MultiSuggestField {...predefinedValues.args} />);

        const clearButton = getByTestId("clear-all-items");
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(queryByTestId("selected-item")).not.toBeInTheDocument();
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
});
