import React from "react";
import { Classes } from "@blueprintjs/core";
import { fireEvent, render, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { AutoSuggestionList, AutoSuggestionListProps } from "../AutoSuggestionList";

describe("Dropdown list", () => {
    let props: AutoSuggestionListProps, mockOptions;
    beforeEach(() => {
        props = {
            currentlyFocusedIndex: 0,
            loading: false,
            isOpen: false,
            options: [],
            itemToHighlight: () => {
                return;
            },
            onItemSelectionChange: () => {
                return;
            },
        };

        mockOptions = [
            {
                query: "organizations",
                from: 0,
                length: 13,
                value: "organizations/name",
            },
            {
                query: "",
                from: 13,
                length: 0,
                value: "/",
            },
        ];
    });

    it("doesn't render when not focused", () => {
        const { container } = render(<AutoSuggestionList {...props} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("should be able to display loading state, when fetching suggestions", () => {
        props = {
            ...props,
            loading: true,
            isOpen: true,
        };
        const { getByText } = render(<AutoSuggestionList {...props} />);
        expect(getByText("Fetching suggestions")).toBeTruthy();
    });

    it("should render list when suggestions are fetched", () => {
        props = {
            ...props,
            loading: false,
            isOpen: true,
            options: mockOptions,
        };
        const { container } = render(<AutoSuggestionList {...props} />);
        const dropdownItems = container.getElementsByTagName("li");
        expect(container).not.toBeEmptyDOMElement();
        expect(dropdownItems.length).toBe(2);
    });

    it("should move horizontally for every cursor movement", async () => {
        const offset = 10;
        props = {
            ...props,
            options: mockOptions,
            loading: false,
            isOpen: true,
            offsetValues: { x: 10, y: 0 },
        };
        const { container } = render(<AutoSuggestionList {...props} />);
        await waitFor(() => {
            const parentDiv: HTMLElement = container.querySelector(`.${eccgui}-autosuggestion__dropdown`)!;
            const leftOffset = Number(parentDiv.style.left.replace(/px$/, ""));
            expect(leftOffset).toBe(offset);
        });
    });

    it("should have one active item at a time", () => {
        props = {
            ...props,
            loading: false,
            isOpen: true,
            options: mockOptions,
        };
        const { container } = render(<AutoSuggestionList {...props} />);
        const activeListItems = Array.from(container.querySelectorAll(`li .${Classes.MENU_ITEM}.${Classes.ACTIVE}`));
        expect(activeListItems.length).toBe(1);
    });

    it("should respond to click on each item and pass the clicked item to autosuggestion", () => {
        const mockOnItemSelection = jest.fn((item) => {
            return;
        });
        props = {
            ...props,
            loading: false,
            isOpen: true,
            options: mockOptions,
            onItemSelectionChange: mockOnItemSelection,
        };
        const { getByText } = render(<AutoSuggestionList {...props} />);
        const dropdownListItem = getByText(props.options[0].query).closest(`.${eccgui}-menu__item`);
        fireEvent.click(dropdownListItem!);
        expect(mockOnItemSelection).toHaveBeenCalledTimes(1);
        expect(mockOnItemSelection).toHaveBeenCalledWith(props.options[0]);
    });

    it("should call highlight function when list item is mouse hovered", () => {
        const mockItemToHighlight = jest.fn((item) => {
            return;
        });
        props = {
            ...props,
            loading: false,
            isOpen: true,
            options: mockOptions,
            itemToHighlight: mockItemToHighlight,
        };
        const { container } = render(<AutoSuggestionList {...props} />);
        const firstItem = container.querySelector("li");
        fireEvent.mouseEnter(firstItem!);
        expect(mockItemToHighlight).toHaveBeenCalledWith(props.options[0]);
        expect(mockItemToHighlight).toHaveBeenCalledTimes(1);
        fireEvent.mouseLeave(firstItem!);
        expect(mockItemToHighlight).toHaveBeenCalledTimes(1);
    });
});
