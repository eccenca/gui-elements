import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { CodeEditor } from "../CodeMirror";

const contextOverlayClass = `${eccgui}-contextoverlay`;

const setupDocumentRange = () => {
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
};

describe("CodeEditor - markdown mode with toolbar", () => {
    beforeAll(() => {
        setupDocumentRange();
    });

    // The toolbar contains a Paragraphs ContextMenu first, then the EditorAppearanceConfigMenu last.
    const getConfigMenuOverlay = (container: HTMLElement) => {
        const overlays = container.getElementsByClassName(contextOverlayClass);
        return overlays[overlays.length - 1] as HTMLElement;
    };

    it("renders toolbar when mode is markdown and useToolbar is true", () => {
        const { container } = render(<CodeEditor name="test-editor" mode="markdown" useToolbar={true} />);
        expect(container.querySelector(`.${eccgui}-codeeditor__toolbar`)).not.toBeNull();
    });

    it("does not render toolbar when useToolbar is false", () => {
        const { container } = render(<CodeEditor name="test-editor" mode="markdown" useToolbar={false} />);
        expect(container.querySelector(`.${eccgui}-codeeditor__toolbar`)).toBeNull();
    });

    it("does not render toolbar for non-markdown modes even when useToolbar is true", () => {
        const { container } = render(<CodeEditor name="test-editor" mode="yaml" useToolbar={true} />);
        expect(container.querySelector(`.${eccgui}-codeeditor__toolbar`)).toBeNull();
    });

    it("includes the EditorAppearanceConfigMenu in the markdown toolbar", () => {
        const { container } = render(<CodeEditor name="test-editor" mode="markdown" useToolbar={true} />);
        const toolbar = container.querySelector(`.${eccgui}-codeeditor__toolbar`);
        // Toolbar contains at least the Paragraphs menu and the EditorAppearanceConfigMenu
        expect(toolbar?.getElementsByClassName(contextOverlayClass).length).toBeGreaterThanOrEqual(2);
    });

    it("defaults wrapLines to true in markdown mode with toolbar", async () => {
        const { container } = render(<CodeEditor name="test-editor" mode="markdown" useToolbar={true} />);

        fireEvent.click(getConfigMenuOverlay(container));

        const wrapLinesItem = await screen.findByText("wrapLines");
        expect(wrapLinesItem.closest("[aria-selected='true']")).not.toBeNull();
    });

    it("defaults preventLineNumbers to true in markdown mode with toolbar", async () => {
        const { container } = render(<CodeEditor name="test-editor" mode="markdown" useToolbar={true} />);

        fireEvent.click(getConfigMenuOverlay(container));

        const preventLineNumbersItem = await screen.findByText("preventLineNumbers");
        expect(preventLineNumbersItem.closest("[aria-selected='true']")).not.toBeNull();
    });

    it("locks wrapLines in config menu when wrapLines prop is explicitly provided", async () => {
        const { container } = render(
            <CodeEditor name="test-editor" mode="markdown" useToolbar={true} wrapLines={false} />,
        );

        fireEvent.click(getConfigMenuOverlay(container));

        const wrapLinesItem = await screen.findByText("wrapLines");
        expect(wrapLinesItem.closest("[aria-disabled='true']")).not.toBeNull();
    });

    it("locks preventLineNumbers in config menu when preventLineNumbers prop is explicitly provided", async () => {
        const { container } = render(
            <CodeEditor name="test-editor" mode="markdown" useToolbar={true} preventLineNumbers={false} />,
        );

        fireEvent.click(getConfigMenuOverlay(container));

        const preventLineNumbersItem = await screen.findByText("preventLineNumbers");
        expect(preventLineNumbersItem.closest("[aria-disabled='true']")).not.toBeNull();
    });

    it("does not lock wrapLines in config menu when wrapLines prop is not provided", async () => {
        const { container } = render(<CodeEditor name="test-editor" mode="markdown" useToolbar={true} />);

        fireEvent.click(getConfigMenuOverlay(container));

        const wrapLinesItem = await screen.findByText("wrapLines");
        expect(wrapLinesItem.closest("[aria-disabled='true']")).toBeNull();
    });

    it("does not lock preventLineNumbers in config menu when preventLineNumbers prop is not provided", async () => {
        const { container } = render(<CodeEditor name="test-editor" mode="markdown" useToolbar={true} />);

        fireEvent.click(getConfigMenuOverlay(container));

        const preventLineNumbersItem = await screen.findByText("preventLineNumbers");
        expect(preventLineNumbersItem.closest("[aria-disabled='true']")).toBeNull();
    });

    it("disables config menu trigger when both wrapLines and preventLineNumbers props are provided", () => {
        const { container } = render(
            <CodeEditor
                name="test-editor"
                mode="markdown"
                useToolbar={true}
                wrapLines={true}
                preventLineNumbers={true}
            />,
        );

        const configMenuTrigger = getConfigMenuOverlay(container).querySelector("button");
        expect(configMenuTrigger).toBeDisabled();
    });

    it("disables config menu trigger when editor is disabled", () => {
        const { container } = render(
            <CodeEditor name="test-editor" mode="markdown" useToolbar={true} disabled={true} />,
        );

        const configMenuTrigger = getConfigMenuOverlay(container).querySelector("button");
        expect(configMenuTrigger).toBeDisabled();
    });
});

describe("CodeEditor - keyboard navigation hint", () => {
    beforeAll(() => {
        setupDocumentRange();
    });

    it("shows the hint on focus with tab indentation in JSON and blurs on Ctrl+Tab", () => {
        render(<CodeEditor name="test-editor" mode="json" tabIntentStyle="tab" />);
        const editor = screen.getByRole("textbox");

        expect(screen.queryByTestId("code-editor-warning")).not.toBeInTheDocument();

        act(() => editor.focus());

        expect(editor).toHaveFocus();
        expect(screen.getByTestId("code-editor-warning")).toBeVisible();

        fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 });
        expect(editor).toHaveFocus();
        expect(screen.getByTestId("code-editor-warning")).toBeVisible();

        fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9, ctrlKey: true });

        expect(editor).not.toHaveFocus();
        expect(screen.queryByTestId("code-editor-warning")).not.toBeInTheDocument();
    });

    it("does not show the hint on focus with tab indentation in YAML", () => {
        render(<CodeEditor name="test-editor" mode="yaml" tabIntentStyle="tab" />);
        const editor = screen.getByRole("textbox");

        act(() => editor.focus());

        expect(editor).toHaveFocus();
        expect(screen.queryByTestId("code-editor-warning")).not.toBeInTheDocument();

        fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 });
        expect(editor).toHaveFocus();
        expect(screen.queryByTestId("code-editor-warning")).not.toBeInTheDocument();
    });

    it("does not show the hint on focus with space indentation", () => {
        render(<CodeEditor name="test-editor" mode="json" tabIntentStyle="space" />);
        const editor = screen.getByRole("textbox");

        act(() => editor.focus());

        expect(editor).toHaveFocus();
        expect(screen.queryByTestId("code-editor-warning")).not.toBeInTheDocument();
    });
});

