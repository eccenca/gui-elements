import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import {
    SingleLineCodeEditor,
    SingleLineCodeEditorProps,
} from "../../../../index";
import CodeMirror from "codemirror";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

describe("SingleLineCodeEditor", () => {
    let props: SingleLineCodeEditorProps,
        codeMirrorEditorInstance: CodeMirror.Editor = null as any;
    beforeEach(() => {
        props = {
            setEditorInstance: jest.fn((editor) => {
                codeMirrorEditorInstance = editor;
            }),
            onChange: jest.fn((value) => {}),
            onCursorChange: jest.fn((pos, coords) => {}),
            mode: null,
            initialValue: "",
            onFocusChange: jest.fn((focused) => {}),
            onKeyDown: jest.fn((event) => {}),
            onSelection: jest.fn((ranges) => {}),
        };
    });

    it("should render properly", () => {
        const { container } = render(<SingleLineCodeEditor {...props} />);
        expect(container.querySelector(`.${eccgui}-singlelinecodeeditor`)).not.toBeNull();
    });

    it("should set the editorInstance immediately it's mounted", () => {
        render(<SingleLineCodeEditor {...props} />);
        expect(props.setEditorInstance).toHaveBeenCalledTimes(1);
        expect(codeMirrorEditorInstance).not.toBeNull();
    });

    it("should set the default value on the editor input", () => {
        props = {
            ...props,
            initialValue: "This is the initial input",
        };
        const { getByText } = render(<SingleLineCodeEditor {...props} />);
        expect(codeMirrorEditorInstance.getValue()).toBe(props.initialValue);
        expect(getByText(props.initialValue)).toBeTruthy();
    });

    it("should not allow user to create new lines", () => {
        render(<SingleLineCodeEditor {...props} />);
        codeMirrorEditorInstance
            .getDoc()
            .setValue("I'm entering a new line \n character");
        expect(codeMirrorEditorInstance.lineCount()).toBe(1);
    });

    it("should convert multiple lines to a single line", () => {
        render(<SingleLineCodeEditor {...{...props, initialValue: "1\n2\n3"}} />);
        expect(codeMirrorEditorInstance.lineCount()).toBe(1);
    });
});
