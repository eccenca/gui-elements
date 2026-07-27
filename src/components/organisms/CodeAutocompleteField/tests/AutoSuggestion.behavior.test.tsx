import React from "react";
import { EditorView } from "@codemirror/view";
import { act, fireEvent, render } from "@testing-library/react";

import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import "@testing-library/jest-dom";

import CodeAutocompleteField, {
    CodeAutocompleteFieldPartialAutoCompleteResult,
    CodeAutocompleteFieldProps,
} from "../AutoSuggestion";

/**
 * Behavioral tests for the CodeAutocompleteField orchestrator (the component historically named
 * `AutoSuggestion`). These drive the *real* embedded CodeMirror editor the same way the neighbouring
 * `ExtendedCodeEditor.test.tsx` suite does (the `document.createRange` shim), and additionally:
 *   - stub `EditorView.prototype.coordsAtPos`, because jsdom performs no layout so the real
 *     implementation returns `null`; the orchestrator's `onCursorChange` wiring (and therefore the
 *     cursor-position-driven suggestion request) is completely gated on a non-null cursor rect.
 *   - use fake timers to step the internal lodash `debounce`s (auto-completion + validation).
 * The editor's `EditorView` is recovered from the DOM via `EditorView.findFromDOM`, mirroring how the
 * component itself would hold the instance, so we can dispatch document/selection changes exactly like
 * user typing does.
 */

// A stable auto-complete response: the token spanning [0, 4) can be replaced by two candidates.
const suggestionResult = (
    inputString: string,
    cursorPosition: number,
): CodeAutocompleteFieldPartialAutoCompleteResult => ({
    inputString,
    cursorPosition,
    replacementResults: [
        {
            extractedQuery: "foo",
            replacementInterval: { from: 0, length: 4 },
            replacements: [
                { value: "foobar", label: "Bar", description: "the bar" },
                { value: "foobaz", label: "Baz", description: "the baz" },
            ],
        },
    ],
});

/** Flush the promise microtask queue inside `act`, so the `await`ed state updates after a debounced
 * `fetchSuggestions` / `checkInput` resolve are applied before we assert. */
const flushMicrotasks = async () => {
    await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
    });
};

/** Index of the currently active (`--active`) dropdown row, or -1. */
const activeItemIndex = () =>
    Array.from(document.querySelectorAll("li")).findIndex((li) =>
        li.className.includes(`${eccgui}-menu__item--active`),
    );

describe("CodeAutocompleteField (AutoSuggestion) behavior", () => {
    let coordsSpy: jest.SpyInstance;

    beforeAll(() => {
        // CodeMirror measures selections through Range APIs that jsdom only partially implements.
        document.createRange = () => {
            const range = new Range();
            range.getBoundingClientRect = jest.fn();
            range.getClientRects = () => ({
                item: () => null,
                length: 0,
                [Symbol.iterator]: jest.fn(),
            });
            return range;
        };
    });

    beforeEach(() => {
        jest.useFakeTimers();
        // jsdom has no layout: the real coordsAtPos returns null which suppresses onCursorChange.
        // A fake cursor rect lets the orchestrator's cursor-change wiring run.
        coordsSpy = jest
            .spyOn(EditorView.prototype, "coordsAtPos")
            .mockReturnValue({ left: 5, right: 6, top: 0, bottom: 12 } as any);
    });

    afterEach(async () => {
        // Drain any still-pending debounced request (e.g. the focus-scheduled suggestion fetch that a
        // test did not advance timers for) and let its awaited state updates settle inside act(), so
        // React doesn't warn about updates outside act() after the test finished.
        await act(async () => {
            jest.runOnlyPendingTimers();
            await Promise.resolve();
            await Promise.resolve();
        });
        coordsSpy.mockRestore();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    const renderField = (over: Partial<CodeAutocompleteFieldProps> = {}) => {
        const onChange = jest.fn();
        const fetchSuggestions = jest.fn((input: string, cursor: number) => suggestionResult(input, cursor));
        const onFocusChange = jest.fn();
        const props: CodeAutocompleteFieldProps = {
            initialValue: "foo",
            onChange,
            fetchSuggestions: fetchSuggestions as any,
            onFocusChange,
            id: "cac-field",
            autoCompletionRequestDelay: 1000,
            validationRequestDelay: 200,
            ...over,
        };
        const utils = render(<CodeAutocompleteField {...props} />);
        const editorView = EditorView.findFromDOM(
            utils.container.querySelector(".cm-editor") as HTMLElement,
        ) as EditorView;
        const editable = utils.container.querySelector(".cm-content") as HTMLElement;
        return { ...utils, editorView, editable, onChange, fetchSuggestions, onFocusChange };
    };

    /** Focus the editor and type `insert` at `at`, leaving the cursor just after the inserted text. */
    const focusAndType = (editable: HTMLElement, editorView: EditorView, at: number, insert: string) => {
        act(() => {
            fireEvent.focus(editable);
        });
        act(() => {
            editorView.dispatch({
                changes: { from: at, insert },
                selection: { anchor: at + insert.length },
            });
        });
    };

    it("debounces the suggestion request and sends the typed value with the cursor position", async () => {
        const { editable, editorView, fetchSuggestions } = renderField();
        // Focus schedules an initial (debounced) request for the initial value; typing right after
        // cancels & reschedules it for the new value/cursor.
        focusAndType(editable, editorView, 3, "x"); // "foo" -> "foox", cursor at 4

        // Nothing must be requested before the debounce delay elapses.
        act(() => {
            jest.advanceTimersByTime(999);
        });
        expect(fetchSuggestions).not.toHaveBeenCalled();

        await act(async () => {
            jest.advanceTimersByTime(1);
        });
        await flushMicrotasks();

        expect(fetchSuggestions).toHaveBeenCalledTimes(1);
        expect(fetchSuggestions).toHaveBeenLastCalledWith("foox", 4);
    });

    it("shows the fetched suggestions in the dropdown once the request resolves", async () => {
        const { editable, editorView } = renderField();
        focusAndType(editable, editorView, 3, "x");
        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        await flushMicrotasks();

        const rows = document.querySelectorAll("li");
        expect(rows.length).toBe(2);
        expect(document.body.textContent).toContain("foobar");
        expect(document.body.textContent).toContain("foobaz");
    });

    it("replaces the selected token and reports the new value via onChange when a suggestion is clicked", async () => {
        const { editable, editorView, onChange } = renderField();
        focusAndType(editable, editorView, 3, "x"); // -> "foox"
        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        await flushMicrotasks();
        onChange.mockClear();

        const firstRow = document.querySelectorAll("li")[0];
        act(() => {
            fireEvent.click(firstRow);
        });
        await flushMicrotasks();

        // replacementInterval {from:0,length:4} replaces the whole "foox" token with "foobar".
        expect(editorView.state.doc.toString()).toBe("foobar");
        expect(onChange).toHaveBeenCalledWith("foobar");
    });

    it("replaces the token and reports onChange when a suggestion is confirmed with Enter", async () => {
        const { editable, editorView, onChange } = renderField();
        focusAndType(editable, editorView, 3, "x");
        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        await flushMicrotasks();
        onChange.mockClear();

        // No arrow navigation: the active index resets to 0, so Enter confirms the first candidate.
        act(() => {
            fireEvent.keyDown(editable, { key: "Enter" });
        });
        await flushMicrotasks();

        expect(editorView.state.doc.toString()).toBe("foobar");
        expect(onChange).toHaveBeenCalledWith("foobar");
    });

    it("moves the active dropdown row via arrow keys, wrapping at the ends", async () => {
        const { editable, editorView } = renderField();
        focusAndType(editable, editorView, 3, "x");
        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        await flushMicrotasks();

        expect(activeItemIndex()).toBe(0);

        act(() => {
            fireEvent.keyDown(editable, { key: "ArrowDown" });
        });
        await flushMicrotasks();
        expect(activeItemIndex()).toBe(1);

        // Wrap forward off the end back to the first row.
        act(() => {
            fireEvent.keyDown(editable, { key: "ArrowDown" });
        });
        await flushMicrotasks();
        expect(activeItemIndex()).toBe(0);

        // Wrap backward off the start to the last row.
        act(() => {
            fireEvent.keyDown(editable, { key: "ArrowUp" });
        });
        await flushMicrotasks();
        expect(activeItemIndex()).toBe(1);
    });

    it("renders the validation highlight, danger intent and validationErrorText when checkInput fails", async () => {
        const checkInput = jest.fn(() => ({
            valid: false,
            parseError: { message: "not allowed here", start: 0, end: 3 },
        }));
        const onInputChecked = jest.fn();
        const { container } = renderField({
            label: "Value path",
            validationErrorText: "The value path is invalid",
            checkInput: checkInput as any,
            onInputChecked,
        } as Partial<CodeAutocompleteFieldProps>);

        // The mount effect validates the initial value once the editor instance is available.
        await act(async () => {
            jest.advanceTimersByTime(200);
        });
        await flushMicrotasks();

        expect(checkInput).toHaveBeenCalledWith("foo");
        // The parse-error span is highlighted in the editor.
        expect(container.querySelector(`.${eccgui}-autosuggestion__text--highlighted-error`)).not.toBeNull();
        // The input wrapper carries the danger intent...
        expect(container.querySelector(`.${eccgui}-intent--danger`)).not.toBeNull();
        // ...and the error message text is shown (via the surrounding FieldItem, which requires a label).
        expect(container.textContent).toContain("The value path is invalid");
        // Consumers are notified the input is invalid.
        expect(onInputChecked).toHaveBeenLastCalledWith(false);
    });

    it("does not flag an error while checkInput reports the value as valid", async () => {
        const checkInput = jest.fn(() => ({ valid: true }));
        const { container } = renderField({
            label: "Value path",
            validationErrorText: "The value path is invalid",
            checkInput: checkInput as any,
        } as Partial<CodeAutocompleteFieldProps>);

        await act(async () => {
            jest.advanceTimersByTime(200);
        });
        await flushMicrotasks();

        expect(container.querySelector(`.${eccgui}-autosuggestion__text--highlighted-error`)).toBeNull();
        expect(container.querySelector(`.${eccgui}-intent--danger`)).toBeNull();
        expect(container.textContent).not.toContain("The value path is invalid");
    });

    it("reports focus changes through onFocusChange on focus and blur", async () => {
        const { editable, onFocusChange } = renderField();

        act(() => {
            fireEvent.focus(editable);
        });
        expect(onFocusChange).toHaveBeenLastCalledWith(true);

        act(() => {
            fireEvent.blur(editable);
        });
        expect(onFocusChange).toHaveBeenLastCalledWith(false);
    });
});
