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
    const editorTestId = "test-editor";
    const footerTestId = `${editorTestId}-footer`;
    const footerVisibleClass = `${eccgui}-codeeditor__footer-content--visible`;

    beforeAll(() => {
        setupDocumentRange();
    });

    it("shows the hint on focus with tab indentation in JSON and releases Tab after Escape", () => {
        render(
            <>
                <CodeEditor data-testid={editorTestId} name="test-editor" mode="json" tabIntentStyle="tab" />
                <button>Next field</button>
            </>,
        );
        const editor = screen.getByRole("textbox");

        expect(screen.getByTestId(footerTestId)).not.toHaveClass(footerVisibleClass);

        act(() => editor.focus());

        expect(editor).toHaveFocus();
        expect(screen.getByTestId(footerTestId)).toHaveClass(footerVisibleClass);
        expect(screen.getByText("Press Escape then Tab to leave the editor.")).toHaveAttribute("lang", "en");
        expect(screen.getByTestId(footerTestId).closest(".cm-panels-bottom")).not.toBeNull();
        expect(screen.getByTestId(footerTestId).closest(`.${eccgui}-codeeditor__footer`)).toHaveClass("cm-panel");
        expect(editor).toHaveAccessibleDescription("Press Escape then Tab to leave the editor.");

        expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(false);
        expect(editor).toHaveFocus();
        expect(screen.getByTestId(footerTestId)).toHaveClass(footerVisibleClass);
        const indentedContent = editor.textContent;
        expect(indentedContent).not.toBe("");

        fireEvent.keyDown(editor, { key: "Escape", code: "Escape", keyCode: 27 });
        expect(editor).toHaveFocus();
        expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(true);
        expect(editor.textContent).toBe(indentedContent);

        // jsdom does not perform the browser's native focus navigation for Tab.
        act(() => screen.getByRole("button", { name: "Next field" }).focus());

        expect(editor).not.toHaveFocus();
        expect(screen.getByTestId(footerTestId)).not.toHaveClass(footerVisibleClass);
    });

    it("does not show the hint on focus with tab indentation in YAML", () => {
        render(<CodeEditor data-testid={editorTestId} name="test-editor" mode="yaml" tabIntentStyle="tab" />);
        const editor = screen.getByRole("textbox");

        act(() => editor.focus());

        expect(editor).toHaveFocus();
        expect(screen.queryByTestId(footerTestId)).not.toBeInTheDocument();

        expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(true);
        expect(screen.queryByTestId(footerTestId)).not.toBeInTheDocument();
    });

    it("does not show the hint on focus with space indentation", () => {
        render(<CodeEditor data-testid={editorTestId} name="test-editor" mode="json" tabIntentStyle="space" />);
        const editor = screen.getByRole("textbox");

        act(() => editor.focus());

        expect(editor).toHaveFocus();
        expect(screen.queryByTestId(footerTestId)).not.toBeInTheDocument();
    });

    it("handles Tab as indentation when enableTab is set", () => {
        render(
            <CodeEditor data-testid={editorTestId} name="test-editor" mode="yaml" tabIntentStyle="space" enableTab />,
        );
        const editor = screen.getByRole("textbox");

        act(() => editor.focus());

        expect(screen.getByTestId(footerTestId)).toBeVisible();
        expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(false);
        expect(editor.textContent).not.toBe("");
    });

    it("leaves Tab available for focus navigation without a mode or enableTab", () => {
        render(<CodeEditor data-testid={editorTestId} name="test-editor" />);
        const editor = screen.getByRole("textbox");

        act(() => editor.focus());

        expect(screen.queryByTestId(footerTestId)).not.toBeInTheDocument();
        expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(true);
        expect(editor.textContent).toBe("");
    });

    it("updates the custom hint and removes the panel and description when Tab indentation is disabled", () => {
        const { rerender } = render(
            <CodeEditor data-testid={editorTestId} name="test-editor" mode="json" tabIntentStyle="tab" />,
        );
        const editor = screen.getByRole("textbox");

        act(() => editor.focus());
        rerender(
            <CodeEditor
                data-testid={editorTestId}
                name="test-editor"
                mode="json"
                tabIntentStyle="tab"
                keyboardHint={<span lang="de">Escape, dann Tab zum Verlassen des Editors.</span>}
            />,
        );

        expect(screen.getByTestId(footerTestId)).toHaveTextContent("Escape, dann Tab zum Verlassen des Editors.");
        expect(editor).toHaveAccessibleDescription("Escape, dann Tab zum Verlassen des Editors.");
        expect(screen.getByText("Escape, dann Tab zum Verlassen des Editors.")).toHaveAttribute("lang", "de");

        rerender(<CodeEditor data-testid={editorTestId} name="test-editor" mode="yaml" tabIntentStyle="tab" />);

        expect(screen.queryByTestId(footerTestId)).not.toBeInTheDocument();
        expect(editor).not.toHaveAttribute("aria-describedby");

        rerender(<CodeEditor data-testid={editorTestId} name="test-editor" mode="json" tabIntentStyle="tab" />);

        expect(screen.getByTestId(footerTestId)).toBeVisible();
        expect(editor).toHaveAccessibleDescription("Press Escape then Tab to leave the editor.");
    });

    it("preserves the language of a custom panel hint", () => {
        render(
            <CodeEditor
                name="test-editor"
                mode="json"
                tabIntentStyle="tab"
                keyboardHint={<span lang="fr">Échap, puis Tab pour quitter l’éditeur.</span>}
            />,
        );

        const editor = screen.getByRole("textbox");
        act(() => editor.focus());
        expect(screen.getByText("Échap, puis Tab pour quitter l’éditeur.")).toHaveAttribute("lang", "fr");
        expect(editor).toHaveAccessibleDescription("Échap, puis Tab pour quitter l’éditeur.");
    });

    it("does not create a footer test ID when the editor has none", () => {
        render(<CodeEditor name="test-editor" mode="json" tabIntentStyle="tab" />);
        const editor = screen.getByRole("textbox");

        act(() => editor.focus());

        const footerContent = screen
            .getByText("Press Escape then Tab to leave the editor.")
            .closest(`.${eccgui}-codeeditor__footer-content`);
        expect(footerContent).not.toHaveAttribute("data-testid");
        expect(footerContent).not.toHaveAttribute("data-test-id");
    });
});
