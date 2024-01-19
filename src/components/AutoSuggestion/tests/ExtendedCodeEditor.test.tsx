import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ExtendedCodeEditor, ExtendedCodeEditorProps } from "../../../../index";
import CodeMirror from "codemirror";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

describe("SingleLineCodeEditor", () => {
    let props: ExtendedCodeEditorProps,
        codeMirrorEditorInstance: CodeMirror.Editor = null as any;

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
            setEditorInstance: jest.fn((editor) => {
                codeMirrorEditorInstance = editor;
            }),
            onChange: jest.fn((value) => {}),
            onCursorChange: jest.fn((pos, coords) => {}),
            mode: undefined,
            initialValue: "",
            onFocusChange: jest.fn((focused) => {}),
            onKeyDown: jest.fn((event) => {}),
            onSelection: jest.fn((ranges) => {}),
        };
    });

    it("should render properly", () => {
        const { container } = render(<ExtendedCodeEditor {...props} />);
        expect(container.querySelector(`.${eccgui}-singlelinecodeeditor`)).not.toBeNull();
    });

    it("should set the editorInstance immediately it's mounted", () => {
        render(<ExtendedCodeEditor {...props} />);
        expect(props.setEditorInstance).toHaveBeenCalledTimes(1);
        expect(codeMirrorEditorInstance).not.toBeNull();
    });

    it("should set the default value on the editor input", () => {
        props = {
            ...props,
            initialValue: "This is the initial input",
        };
        const { getByText } = render(<ExtendedCodeEditor {...props} />);
        expect(codeMirrorEditorInstance.getValue()).toBe(props.initialValue);
        expect(getByText(props.initialValue)).toBeTruthy();
    });

    it("should not allow user to create new lines", () => {
        render(<ExtendedCodeEditor {...props} />);
        codeMirrorEditorInstance.getDoc().setValue("I'm entering a new line \n character");
        expect(codeMirrorEditorInstance.lineCount()).toBe(1);
    });

    it("should convert multiple lines to a single line", () => {
        render(<ExtendedCodeEditor {...{ ...props, initialValue: "1\n2\n3" }} />);
        expect(codeMirrorEditorInstance.lineCount()).toBe(1);
    });
});
