import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import AutoSuggestion, { AutoSuggestionProps } from "../AutoSuggestion";

describe("AutoSuggestion", () => {
    let props: AutoSuggestionProps;
    beforeAll(() => {
        document.createRange = () => {
            const range = new Range();
            range.getBoundingClientRect = jest.fn();
            range.getClientRects = () => {
                return {
                    item: () => null,
                    length: 0,
                    [Symbol.iterator]: jest.fn(),
                };
            };
            return range;
        };
    });

    beforeEach(() => {
        props = {
            label: "test value path",
            initialValue: "",
            onChange: jest.fn((value) => {}),
            fetchSuggestions: jest.fn((inputString, cursorPosition) => undefined),
            checkInput: jest.fn((inputString) => ({
                valid: true,
            })),
            onInputChecked: jest.fn((validInput) => {}),
            validationErrorText: "",
            clearIconText: "",
            onFocusChange: jest.fn((hasFocus) => {}),
            id: "test-auto-suggestion",
        };
    });

    it("should render properly", () => {
        const { container } = render(<AutoSuggestion {...props} />);
        expect(container).not.toBeEmptyDOMElement();
    });

    it("should set label prop properly", () => {
        const { getByText } = render(<AutoSuggestion {...props} />);
        expect(getByText(props.label!!)).toBeTruthy();
    });
});
