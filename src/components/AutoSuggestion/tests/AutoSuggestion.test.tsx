import React from "react";
import { EditorView } from "@codemirror/view";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

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
        expect(getByText(props.label!)).toBeTruthy();
    });

    it.each([false, true])("updates the container height (multiline: %s)", (multiline) => {
        const { container, rerender } = render(<AutoSuggestion {...props} multiline={multiline} height={120} />);
        const editorContainer = container.querySelector<HTMLElement>(".eccgui-codeeditor");
        expect(editorContainer).toHaveStyle({ height: "120px" });

        rerender(<AutoSuggestion {...props} multiline={multiline} height="10rem" />);
        expect(editorContainer).toHaveStyle({ height: "10rem" });

        rerender(<AutoSuggestion {...props} multiline={multiline} />);
        expect(editorContainer?.style.height).toBe("");
    });

    it.each([
        { multiline: false, useTabForCompletions: false },
        { multiline: false, useTabForCompletions: true },
        { multiline: true, useTabForCompletions: false },
        { multiline: true, useTabForCompletions: true },
    ])(
        "separates closing suggestions from Escape then Tab navigation ($multiline, $useTabForCompletions)",
        async ({ multiline, useTabForCompletions }) => {
            render(
                <AutoSuggestion
                    {...props}
                    initialValue="value"
                    mode="json"
                    multiline={multiline}
                    useTabForCompletions={useTabForCompletions}
                    autoCompletionRequestDelay={0}
                    fetchSuggestions={(inputString, cursorPosition) => ({
                        inputString,
                        cursorPosition,
                        replacementResults: [
                            {
                                replacementInterval: { from: 0, length: 5 },
                                extractedQuery: "",
                                replacements: [{ value: "completion" }],
                            },
                        ],
                    })}
                />,
            );
            const editor = screen.getByRole("textbox");
            act(() => editor.focus());
            expect(await screen.findByText("completion")).toBeVisible();
            const view = EditorView.findFromDOM(editor);
            act(() => view?.dispatch({ selection: { anchor: 0, head: 5 } }));
            const initialContent = editor.textContent;

            // With suggestions open, Escape only closes the dropdown.
            expect(fireEvent.keyDown(editor, { key: "Escape", code: "Escape", keyCode: 27 })).toBe(false);

            await waitFor(() => expect(screen.queryByText("completion")).not.toBeInTheDocument());
            expect(editor).toHaveFocus();
            expect(editor.textContent).toBe(initialContent);

            expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(false);
            const contentAfterIndent = editor.textContent;
            expect(contentAfterIndent).not.toBe(initialContent);

            // Once the dropdown is closed, Escape enables CodeMirror's temporary tab-focus mode.
            expect(fireEvent.keyDown(editor, { key: "Escape", code: "Escape", keyCode: 27 })).toBe(true);
            expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(true);
            expect(editor.textContent).toBe(contentAfterIndent);
        },
    );
});
