import React from "react";
import { EditorView } from "@codemirror/view";
import { act, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { ExtendedCodeEditor, ExtendedCodeEditorProps } from "../../../../index";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

describe("SingleLineCodeEditor", () => {
    let props: ExtendedCodeEditorProps,
        cm: EditorView | null = null;

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
            setCM: jest.fn((editor) => {
                cm = editor as EditorView;
            }),
            onChange: jest.fn((value) => {}),
            onCursorChange: jest.fn((pos, coords) => {}),
            mode: undefined,
            initialValue: "",
            onFocusChange: jest.fn((focused) => {}),
            onKeyDown: jest.fn((event) => true),
            onSelection: jest.fn((ranges) => {}),
        };
    });

    it("should render properly", () => {
        const { container } = render(<ExtendedCodeEditor {...props} />);
        expect(container.querySelector(`.${eccgui}-singlelinecodeeditor`)).not.toBeNull();
    });

    it("should set the editorInstance immediately it's mounted", () => {
        render(<ExtendedCodeEditor {...props} />);
        expect(props.setCM).toHaveBeenCalled();
        expect(cm).not.toBeNull();
    });

    it("should set the default value on the editor input", () => {
        props = {
            ...props,
            initialValue: "This is the initial input",
        };
        const { getByText } = render(<ExtendedCodeEditor {...props} />);
        expect(cm?.state.doc.toString()).toBe(props.initialValue);
        expect(getByText(props.initialValue)).toBeTruthy();
    });

    it("should not allow user to create new lines", () => {
        render(<ExtendedCodeEditor {...props} />);
        cm?.dispatch({
            changes: { from: 0, to: cm.state.doc.length, insert: "I'm entering a new line \n character" },
        });
        expect(cm?.state.doc.lines).toBe(1);
    });

    it("should convert multiple lines to a single line", () => {
        render(<ExtendedCodeEditor {...{ ...props, initialValue: "1\n2\n3" }} />);
        expect(cm?.state.doc.lines).toBe(1);
    });

    it.each([
        { multiline: true, draft: "unsaved draft" },
        { multiline: false, draft: "unsaved\nsecond line" },
    ])("preserves the draft and selection when multiline changes to $multiline", ({ multiline, draft }) => {
        const editorProps = { ...props, initialValue: "initial" };
        const { rerender } = render(<ExtendedCodeEditor {...editorProps} multiline={!multiline} />);
        const editor = EditorView.findFromDOM(screen.getByRole("textbox"));

        if (!editor) {
            throw new Error("Expected the mounted CodeMirror editor");
        }
        const selection = { anchor: draft.length, head: 2 };
        act(() => {
            editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: draft }, selection });
        });
        expect(editor.state.doc.toString()).toBe(draft);
        expect(editor.state.selection.main).toMatchObject(selection);

        rerender(<ExtendedCodeEditor {...editorProps} multiline={multiline} />);

        expect(EditorView.findFromDOM(screen.getByRole("textbox"))).toBe(editor);
        expect(editor.state.doc.toString()).toBe(draft);
        expect(editor.state.selection.main).toMatchObject(selection);
    });

    it("allows editing and removing existing lines after switching to single-line mode", () => {
        const editorProps = { ...props, initialValue: "first\nsecond" };
        const { rerender } = render(<ExtendedCodeEditor {...editorProps} multiline />);
        const editor = EditorView.findFromDOM(screen.getByRole("textbox"));

        if (!editor) {
            throw new Error("Expected the mounted CodeMirror editor");
        }
        rerender(<ExtendedCodeEditor {...editorProps} multiline={false} />);

        act(() => editor.dispatch({ changes: { from: 0, insert: "draft " } }));
        expect(editor.state.doc.toString()).toBe("draft first\nsecond");
        act(() => editor.dispatch({ changes: { from: 0, insert: "\n" } }));
        expect(editor.state.doc.toString()).toBe("draft first\nsecond");
        act(() => editor.dispatch({ changes: { from: 11, to: 12, insert: " " } }));
        expect(editor.state.doc.toString()).toBe("draft first second");
    });

    it.each([
        { multiline: true, expectedText: "draft\nnext line" },
        { multiline: false, expectedText: "draft" },
    ])("updates newline handling and wrapping when multiline changes to $multiline", ({ multiline, expectedText }) => {
        const editorProps = { ...props, initialValue: "draft" };
        const { rerender } = render(<ExtendedCodeEditor {...editorProps} multiline={!multiline} />);
        const content = screen.getByRole("textbox");
        const editor = EditorView.findFromDOM(content);

        if (!editor) {
            throw new Error("Expected the mounted CodeMirror editor");
        }
        act(() => editor.dispatch({ selection: { anchor: 5 } }));

        rerender(<ExtendedCodeEditor {...editorProps} multiline={multiline} />);

        expect(screen.getByRole("textbox")).toBe(content);
        expect(editor.state.selection.main.head).toBe(5);

        act(() => editor.dispatch({ changes: { from: 5, insert: "\nnext line" } }));

        expect({
            text: editor.state.doc.toString(),
            wraps: content.classList.contains("cm-lineWrapping"),
        }).toEqual({ text: expectedText, wraps: multiline });
    });
});
