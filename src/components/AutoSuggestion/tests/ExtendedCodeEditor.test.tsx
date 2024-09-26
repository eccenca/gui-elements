import React from "react";
import { render } from "@testing-library/react";
import { EditorView } from "@codemirror/view";

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
});
