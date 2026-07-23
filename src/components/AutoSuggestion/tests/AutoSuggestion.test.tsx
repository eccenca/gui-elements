import React from "react";
import { render, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

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
            onChange: jest.fn(),
            fetchSuggestions: jest.fn(() => undefined),
            checkInput: jest.fn(() => ({
                valid: true,
            })),
            onInputChecked: jest.fn(),
            validationErrorText: "",
            clearIconText: "",
            onFocusChange: jest.fn(),
            id: "test-auto-suggestion",
        };
    });

    it("should render properly", () => {
        const { container } = render(<AutoSuggestion {...props} />);
        expect(container).not.toBeEmptyDOMElement();
    });

    it("should set label prop properly", () => {
        const { getByText } = render(<AutoSuggestion {...props} />);
        expect(getByText(props.label!)).toBeTruthy();
    });

    it("should render the validation error highlighting for the reported range", async () => {
        const { container } = render(
            <AutoSuggestion
                {...props}
                initialValue={"{{project.testx}}"}
                validationRequestDelay={1}
                checkInput={() => ({
                    valid: false,
                    parseError: { message: "'project.testx' is not defined.", start: 2, end: 15 },
                })}
            />,
        );
        await waitFor(() => {
            const errorMark = container.querySelector(".eccgui-autosuggestion__text--highlighted-error");
            expect(errorMark).toBeTruthy();
            expect(errorMark!.textContent).toBe("project.testx");
        });
    });
});
