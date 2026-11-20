import React from "react";
import { EditorView } from "@codemirror/view";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import { Modal } from "../../Dialog/Modal";
import CodeAutocompleteField, {
    CodeAutocompleteFieldProps,
    CodeAutocompleteFieldValidationResult,
} from "../AutoSuggestion";

const validTemplate = "{{project.test}}\n\n{{project.test}}";
const invalidTemplate = "{{project.testx}}\n\n{{project.test}}";
const validationError = {
    valid: false,
    parseError: { start: 2, end: 15, message: "Unknown variable" },
};
const underlineSelector = ".eccgui-autosuggestion__text--highlighted-error";
const underlinedText = () =>
    Array.from(document.querySelectorAll(underlineSelector), (span) => span.textContent).join("");
const suggestVariable: CodeAutocompleteFieldProps["fetchSuggestions"] = (inputString, cursorPosition) => ({
    inputString,
    cursorPosition,
    replacementResults: [
        {
            replacementInterval: { from: 2, length: 12 },
            extractedQuery: "project",
            replacements: [{ value: "project.test" }],
        },
    ],
});

function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((complete) => {
        resolve = complete;
    });
    return { promise, resolve };
}

describe("CodeAutocompleteField", () => {
    let props: CodeAutocompleteFieldProps;

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
        const { container } = render(<CodeAutocompleteField {...props} />);
        expect(container).not.toBeEmptyDOMElement();
    });

    it("should set label prop properly", () => {
        const { getByText } = render(<CodeAutocompleteField {...props} />);
        expect(getByText(props.label!)).toBeTruthy();
    });

    it("normalizes line endings before reinitializing a multiline document", () => {
        const field = (initialValue: string) => (
            <CodeAutocompleteField {...props} initialValue={initialValue} multiline reInitOnInitialValueChange />
        );
        const { rerender } = render(field("first\r\nsecond"));
        const view = EditorView.findFromDOM(screen.getByRole("combobox"))!;
        expect(view.state.doc.toString()).toBe("first\nsecond");
        expect(props.onChange).not.toHaveBeenCalled();

        rerender(field("first\nsecond"));
        expect(props.onChange).not.toHaveBeenCalled();

        rerender(field("first\r\nupdated"));
        expect(view.state.doc.toString()).toBe("first\nupdated");
        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith("first\nupdated");
    });

    describe("validation underlines", () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });
        afterEach(() => {
            jest.useRealTimers();
        });

        const advance = async (ms: number) => {
            await act(async () => {
                jest.advanceTimersByTime(ms);
            });
        };

        it.each(["Escape", "blur"])("keeps the underline when %s closes highlighted suggestions", async (action) => {
            const checkInput = jest.fn(() => validationError);
            render(
                <CodeAutocompleteField
                    {...props}
                    initialValue={invalidTemplate}
                    mode="jinja2"
                    multiline
                    validationRequestDelay={250}
                    autoCompletionRequestDelay={500}
                    checkInput={checkInput}
                    fetchSuggestions={suggestVariable}
                />,
            );
            const editor = screen.getByRole("combobox");
            act(() => editor.focus());
            await advance(500);
            expect(editor.querySelector(".eccgui-autosuggestion__text--highlighted")).toBeInTheDocument();
            expect(underlinedText()).toBe("project.testx");
            expect(document.querySelector(underlineSelector)).toHaveAttribute(
                "title",
                validationError.parseError.message,
            );

            if (action === "Escape") {
                fireEvent.keyDown(editor, { key: "Escape", code: "Escape", keyCode: 40 });
            } else {
                act(() => editor.blur());
            }

            expect(editor).toHaveAttribute("aria-expanded", "false");
            expect(underlinedText()).toBe("project.testx");
            expect(checkInput).toHaveBeenCalledTimes(1);
        });

        it("keeps a new underline while the next autocomplete request is pending", async () => {
            const autocomplete = deferred<undefined>();
            const fetchSuggestions = jest.fn((text: string, cursor: number) =>
                text.includes("testx") ? autocomplete.promise : suggestVariable(text, cursor),
            );
            render(
                <CodeAutocompleteField
                    {...props}
                    initialValue={validTemplate}
                    mode="jinja2"
                    multiline
                    validationRequestDelay={250}
                    autoCompletionRequestDelay={500}
                    checkInput={(text) => (text === invalidTemplate ? validationError : { valid: true })}
                    fetchSuggestions={fetchSuggestions}
                />,
            );
            const editor = screen.getByRole("combobox");
            const view = EditorView.findFromDOM(editor)!;
            jest.spyOn(view, "coordsAtPos").mockReturnValue({ left: 0, right: 1, top: 0, bottom: 1 });
            act(() => editor.focus());
            await advance(500);
            expect(editor.querySelector(".eccgui-autosuggestion__text--highlighted")).toBeInTheDocument();

            act(() => view.dispatch({ changes: { from: 14, insert: "x" }, selection: { anchor: 15 } }));
            await advance(250);
            expect(underlinedText()).toBe("project.testx");
            expect(fetchSuggestions).toHaveBeenCalledTimes(1);

            await advance(250);
            expect(fetchSuggestions).toHaveBeenLastCalledWith("{{project.testx}}", 15);
            expect(editor).toHaveAttribute("aria-expanded", "false");
            expect(underlinedText()).toBe("project.testx");
            await act(async () => autocomplete.resolve(undefined));
        });

        it("ignores an older response when the latest edit has already been validated", async () => {
            const oldValidation = deferred<CodeAutocompleteFieldValidationResult>();
            const checkInput = jest.fn((text: string) =>
                text === validTemplate ? oldValidation.promise : validationError,
            );
            render(
                <CodeAutocompleteField
                    {...props}
                    initialValue={validTemplate}
                    mode="jinja2"
                    multiline
                    validationRequestDelay={250}
                    checkInput={checkInput}
                />,
            );
            await advance(250);
            expect(checkInput).toHaveBeenCalledWith(validTemplate);

            const view = EditorView.findFromDOM(screen.getByRole("combobox"))!;
            act(() => view.dispatch({ changes: { from: 14, insert: "x" } }));
            await advance(250);
            expect(underlinedText()).toBe("project.testx");
            expect(props.onInputChecked).toHaveBeenLastCalledWith(false);

            await act(async () => oldValidation.resolve({ valid: true }));
            expect(underlinedText()).toBe("project.testx");
            expect(props.onInputChecked).toHaveBeenLastCalledWith(false);
        });

        it("keeps the old field error hidden when another edit queues validation", async () => {
            const firstEditValidation = deferred<CodeAutocompleteFieldValidationResult>();
            const checkInput = jest.fn((text: string) =>
                text === validTemplate ? firstEditValidation.promise : validationError,
            );
            const errorText = "Template validation failed";
            render(
                <CodeAutocompleteField
                    {...props}
                    initialValue={invalidTemplate}
                    mode="jinja2"
                    multiline
                    validationRequestDelay={250}
                    validationErrorText={errorText}
                    checkInput={checkInput}
                />,
            );
            const editor = screen.getByRole("combobox");
            const view = EditorView.findFromDOM(editor)!;
            const input = editor.closest(".eccgui-autosuggestion__inputfield");
            await advance(250);
            expect(screen.getByText(errorText)).toBeVisible();
            expect(input).toHaveClass("eccgui-intent--danger");

            act(() => view.dispatch({ changes: { from: 14, to: 15 } }));
            expect(screen.queryByText(errorText)).not.toBeInTheDocument();
            await advance(250);
            expect(checkInput).toHaveBeenLastCalledWith(validTemplate);
            expect(screen.queryByText(errorText)).not.toBeInTheDocument();

            act(() => view.dispatch({ changes: { from: 14, insert: "x" } }));
            expect(checkInput).toHaveBeenCalledTimes(2);
            expect(screen.queryByText(errorText)).not.toBeInTheDocument();
            expect(input).not.toHaveClass("eccgui-intent--danger");

            await act(async () => firstEditValidation.resolve({ valid: true }));
            expect(props.onInputChecked).toHaveBeenLastCalledWith(false);
            await advance(250);
            expect(checkInput).toHaveBeenLastCalledWith(invalidTemplate);
            expect(screen.getByText(errorText)).toBeVisible();
            expect(input).toHaveClass("eccgui-intent--danger");
        });

        it("clears a previous underline on edit and validates returning to the same text", async () => {
            const checkInput = jest.fn((text: string) =>
                text === invalidTemplate ? validationError : { valid: true },
            );
            render(
                <CodeAutocompleteField
                    {...props}
                    initialValue={invalidTemplate}
                    mode="jinja2"
                    multiline
                    validationRequestDelay={250}
                    checkInput={checkInput}
                />,
            );
            const view = EditorView.findFromDOM(screen.getByRole("combobox"))!;
            await advance(250);
            expect(underlinedText()).toBe("project.testx");

            act(() => view.dispatch({ changes: { from: 14, to: 15 } }));
            expect(underlinedText()).toBe("");
            expect(props.onInputChecked).toHaveBeenLastCalledWith(false);
            act(() => view.dispatch({ changes: { from: 14, insert: "x" } }));
            await advance(250);
            expect(checkInput.mock.calls).toEqual([[invalidTemplate], [invalidTemplate]]);
            expect(underlinedText()).toBe("project.testx");

            act(() => view.dispatch({ changes: { from: 14, to: 15 } }));
            await advance(250);
            expect(underlinedText()).toBe("");
            expect(props.onInputChecked).toHaveBeenLastCalledWith(true);
        });

        it("restores the accepted underline when the editor view is replaced", async () => {
            const checkInput = jest.fn(() => validationError);
            const editorProps = { ...props, initialValue: invalidTemplate, multiline: true, checkInput };
            const { rerender } = render(<CodeAutocompleteField {...editorProps} />);
            const originalView = EditorView.findFromDOM(screen.getByRole("combobox"));
            await advance(200);
            expect(underlinedText()).toBe("project.testx");

            rerender(<CodeAutocompleteField {...editorProps} label={undefined} />);
            expect(EditorView.findFromDOM(screen.getByRole("combobox"))).not.toBe(originalView);
            expect(underlinedText()).toBe("project.testx");
            await advance(200);
            expect(checkInput).toHaveBeenCalledTimes(1);
        });

        it("validates the displayed template each time the modal opens", async () => {
            const checkInput = jest.fn(() => validationError);
            const modal = (isOpen: boolean) => (
                <Modal isOpen={isOpen} usePortal={false} transitionDuration={0} aria-label="Template editor">
                    <div>
                        {isOpen && (
                            <CodeAutocompleteField
                                {...props}
                                initialValue={invalidTemplate}
                                mode="jinja2"
                                multiline
                                validationRequestDelay={250}
                                checkInput={checkInput}
                            />
                        )}
                    </div>
                </Modal>
            );
            const { rerender } = render(modal(true));
            await advance(250);
            expect(underlinedText()).toBe("project.testx");

            rerender(modal(false));
            await waitFor(() => expect(underlinedText()).toBe(""));
            rerender(modal(true));
            await advance(250);
            expect(underlinedText()).toBe("project.testx");
            expect(checkInput.mock.calls).toEqual([[invalidTemplate], [invalidTemplate]]);
        });
    });

    it("connects the focused editor to the active suggestion", async () => {
        const { container } = render(
            <CodeAutocompleteField
                {...props}
                initialValue="value"
                autoCompletionRequestDelay={0}
                fetchSuggestions={(inputString, cursorPosition) => ({
                    inputString,
                    cursorPosition,
                    replacementResults: [
                        {
                            replacementInterval: { from: 0, length: 5 },
                            extractedQuery: "",
                            replacements: [{ value: "first" }, { value: "second" }],
                        },
                    ],
                })}
            />,
        );
        const editor = screen.getByRole("combobox");
        act(() => editor.focus());
        const options = await screen.findAllByRole("option");
        expect(container.querySelector('[aria-haspopup="menu"]')).toBeNull();
        expect(editor).toHaveAttribute("aria-haspopup", "listbox");
        expect(editor).toHaveAttribute("aria-controls", options[0].parentElement?.id);
        expect(editor).toHaveAttribute("aria-activedescendant", options[0].id);
        fireEvent.keyDown(editor, { key: "ArrowDown", code: "ArrowDown", keyCode: 40 });
        await waitFor(() => expect(editor).toHaveAttribute("aria-activedescendant", options[1].id));
        fireEvent.keyDown(editor, { key: "Escape", code: "Escape", keyCode: 27 });
        await waitFor(() => expect(editor).toHaveAttribute("aria-expanded", "false"));
        expect(editor).not.toHaveAttribute("aria-activedescendant");
    });

    it.each([false, true])("updates the container height (multiline: %s)", (multiline) => {
        const { container, rerender } = render(<CodeAutocompleteField {...props} multiline={multiline} height={120} />);
        const editorContainer = container.querySelector<HTMLElement>(".eccgui-codeeditor");
        expect(editorContainer).toHaveStyle({ height: "120px" });

        rerender(<CodeAutocompleteField {...props} multiline={multiline} height="10rem" />);
        expect(editorContainer).toHaveStyle({ height: "10rem" });

        rerender(<CodeAutocompleteField {...props} multiline={multiline} />);
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
                <CodeAutocompleteField
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
            const editor = screen.getByRole("combobox");
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

            if (!useTabForCompletions) {
                // Tab is not handled by the editor and stays available for focus navigation.
                expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(true);
                expect(editor.textContent).toBe(initialContent);
                return;
            }

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
