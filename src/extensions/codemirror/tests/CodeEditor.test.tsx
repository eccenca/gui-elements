import React from "react";
import { redo, undo } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { act, fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import SimpleDialog from "../../../components/Dialog/SimpleDialog";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { CodeEditor, CodeEditorProps } from "../CodeMirror";

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

describe("CodeEditor - prop changes after mount", () => {
    beforeAll(() => {
        setupDocumentRange();
    });

    const callbackCases: [keyof CodeEditorProps, (editor: EditorView) => void][] = [
        ["onCursorChange", (editor) => act(() => editor.dispatch({ selection: { anchor: 1 } }))],
        ["onKeyDown", (editor) => fireEvent.keyDown(editor.contentDOM, { key: "Enter" })],
        ["onMouseDown", (editor) => fireEvent.mouseDown(editor.contentDOM)],
        ["onFocusChange", (editor) => fireEvent.focus(editor.contentDOM)],
        ["onSelection", (editor) => act(() => editor.dispatch({ selection: { anchor: 0, head: 1 } }))],
        ["onScroll", (editor) => fireEvent.scroll(editor.scrollDOM)],
    ];

    const statePreservationCases: [string, Partial<CodeEditorProps>, Partial<CodeEditorProps>][] = [
        [
            "the callbacks change",
            Object.fromEntries(callbackCases.map(([prop]) => [prop, jest.fn(() => true)])),
            Object.fromEntries(callbackCases.map(([prop]) => [prop, jest.fn(() => true)])),
        ],
        [
            "additional extensions change",
            { additionalExtensions: [EditorView.contentAttributes.of({ "aria-label": "Source expression" })] },
            { additionalExtensions: [EditorView.contentAttributes.of({ "aria-label": "Target expression" })] },
        ],
        [
            "wrapping and line numbers change together",
            { wrapLines: false, preventLineNumbers: false },
            { wrapLines: true, preventLineNumbers: true },
        ],
        ["intent changes", { intent: "warning" }, { intent: "danger" }],
    ];

    it.each(statePreservationCases)("preserves editor state when %s", (_description, before, after) => {
        const editorProps = { name: "test-editor", defaultValue: "initial" };
        const { rerender } = render(<CodeEditor {...editorProps} {...before} />);
        const content = screen.getByRole("textbox");
        const editor = EditorView.findFromDOM(content);

        if (!editor) {
            throw new Error("Expected the mounted CodeMirror editor");
        }
        const draft = "unsaved draft";
        const selection = { anchor: 8, head: 2 };
        act(() => {
            editor.focus();
            editor.dispatch({
                changes: { from: 0, to: editor.state.doc.length, insert: draft },
                selection,
                userEvent: "input.type",
            });
        });
        expect(content).toHaveFocus();

        rerender(<CodeEditor {...editorProps} {...after} />);

        expect(EditorView.findFromDOM(screen.getByRole("textbox"))).toBe(editor);
        expect(editor.state.doc.toString()).toBe(draft);
        expect(editor.state.selection.main).toMatchObject(selection);
        expect(content).toHaveFocus();
        act(() => {
            expect(undo(editor)).toBe(true);
        });
        expect(editor.state.doc.toString()).toBe(editorProps.defaultValue);
        act(() => {
            expect(redo(editor)).toBe(true);
        });
        expect(editor.state.doc.toString()).toBe(draft);
    });

    it.each(callbackCases)("uses the latest %s callback", (prop, trigger) => {
        const originalCallback = jest.fn(() => true);
        const nextCallback = jest.fn(() => true);
        const editorProps = { name: "test-editor", defaultValue: "draft" };
        const { rerender } = render(<CodeEditor {...editorProps} {...{ [prop]: originalCallback }} />);
        const content = screen.getByRole("textbox");
        const editor = EditorView.findFromDOM(content);

        if (!editor) {
            throw new Error("Expected the mounted CodeMirror editor");
        }
        const coordsAtPos = jest.spyOn(editor, "coordsAtPos").mockReturnValue(new DOMRect(1, 2, 3, 4));

        try {
            trigger(editor);
            expect(originalCallback).toHaveBeenCalled();

            rerender(<CodeEditor {...editorProps} {...{ [prop]: nextCallback }} />);
            expect(screen.getByRole("textbox")).toBe(content);
            originalCallback.mockClear();
            nextCallback.mockClear();

            trigger(editor);
            expect(nextCallback).toHaveBeenCalled();
            expect(originalCallback).not.toHaveBeenCalled();
        } finally {
            coordsAtPos.mockRestore();
        }
    });

    it("replaces and removes additional extensions on the mounted editor", () => {
        const onSelection = jest.fn();
        const editorProps = { name: "test-editor", defaultValue: "draft", onSelection };
        const firstExtension = EditorView.contentAttributes.of({ "aria-label": "Source expression" });
        const nextExtension = EditorView.contentAttributes.of({ "aria-label": "Target expression" });
        const { rerender } = render(<CodeEditor {...editorProps} additionalExtensions={[firstExtension]} />);
        const content = screen.getByRole("textbox");
        expect(content).toHaveAccessibleName("Source expression");
        onSelection.mockClear();

        rerender(<CodeEditor {...editorProps} additionalExtensions={[nextExtension]} />);

        expect(screen.getByRole("textbox")).toBe(content);
        expect(content).toHaveAccessibleName("Target expression");

        rerender(<CodeEditor {...editorProps} />);

        expect(screen.getByRole("textbox")).toBe(content);
        expect(content).not.toHaveAttribute("aria-label");
        expect(onSelection).not.toHaveBeenCalled();
    });

    it("can remove an extension whose transaction filter rejects edits", () => {
        const blockingExtension = EditorState.transactionFilter.of(() => []);
        const { rerender } = render(<CodeEditor name="test-editor" additionalExtensions={[blockingExtension]} />);
        const editor = EditorView.findFromDOM(screen.getByRole("textbox"));

        if (!editor) {
            throw new Error("Expected the mounted CodeMirror editor");
        }
        act(() => editor.dispatch({ changes: { from: 0, insert: "draft" } }));
        expect(editor.state.doc.toString()).toBe("");

        rerender(<CodeEditor name="test-editor" />);
        act(() => editor.dispatch({ changes: { from: 0, insert: "draft" } }));

        expect(editor.state.doc.toString()).toBe("draft");
    });

    it("updates wrapping and line numbers together", () => {
        const { container, rerender } = render(
            <CodeEditor name="test-editor" wrapLines={false} preventLineNumbers={false} />,
        );
        const content = screen.getByRole("textbox");
        expect(content).not.toHaveClass("cm-lineWrapping");
        expect(container.querySelector(".cm-lineNumbers")).toBeInTheDocument();

        rerender(<CodeEditor name="test-editor" wrapLines preventLineNumbers />);

        expect(screen.getByRole("textbox")).toBe(content);
        expect(content).toHaveClass("cm-lineWrapping");
        expect(container.querySelector(".cm-lineNumbers")).not.toBeInTheDocument();
    });

    it("preserves intent through focus and blur without a focus callback", () => {
        const { rerender } = render(<CodeEditor name="test-editor" intent="warning" />);
        const editor = EditorView.findFromDOM(screen.getByRole("textbox"));

        if (!editor) {
            throw new Error("Expected the mounted CodeMirror editor");
        }
        expect(editor.dom).toHaveClass(`${eccgui}-intent--warning`);

        act(() => {
            editor.focus();
            editor.dispatch({});
        });
        expect(editor.dom).toHaveClass("cm-focused", `${eccgui}-intent--warning`);

        rerender(<CodeEditor name="test-editor" intent="danger" />);
        expect(EditorView.findFromDOM(screen.getByRole("textbox"))).toBe(editor);
        expect(editor.dom).toHaveClass(`${eccgui}-intent--danger`);
        expect(editor.dom).not.toHaveClass(`${eccgui}-intent--warning`);

        act(() => {
            editor.contentDOM.blur();
            editor.dispatch({});
        });
        expect(editor.dom).not.toHaveClass("cm-focused");
        expect(editor.dom).toHaveClass(`${eccgui}-intent--danger`);
    });

    it.each([false, true])("updates and clears intent across theme changes (disabled=%s)", (disabled) => {
        const editorProps = { name: "test-editor", disabled };
        const { rerender } = render(<CodeEditor {...editorProps} intent="warning" />);
        const editor = EditorView.findFromDOM(screen.getByRole("textbox"));

        if (!editor) {
            throw new Error("Expected the mounted CodeMirror editor");
        }
        const theme = EditorView.theme({ "&": { fontSize: "1.125rem" } });
        const originalTheme = editor.themeClasses;

        rerender(<CodeEditor {...editorProps} intent="danger" additionalExtensions={[theme]} />);

        expect(EditorView.findFromDOM(screen.getByRole("textbox"))).toBe(editor);
        expect(editor.themeClasses).not.toBe(originalTheme);
        expect(editor.dom).toHaveClass(`${eccgui}-intent--danger`);
        expect(editor.dom).not.toHaveClass(`${eccgui}-intent--warning`);
        if (disabled) {
            expect(editor.dom).toHaveClass(`${eccgui}-disabled`);
        }

        rerender(<CodeEditor {...editorProps} />);

        expect(editor.themeClasses).toBe(originalTheme);
        expect(editor.dom).not.toHaveClass(`${eccgui}-intent--danger`);
        if (disabled) {
            expect(editor.dom).toHaveClass(`${eccgui}-disabled`);
        }

        rerender(<CodeEditor {...editorProps} disabled={!disabled} intent="success" />);

        expect(editor.contentDOM).toHaveAttribute("contenteditable", String(disabled));
        expect(editor.dom.classList.contains(`${eccgui}-disabled`)).toBe(!disabled);
        expect(editor.dom).toHaveClass(`${eccgui}-intent--success`);
    });
});

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

    it("restores the current appearance defaults when appearance props are cleared", () => {
        const { container, rerender } = render(
            <CodeEditor name="test-editor" mode="markdown" wrapLines={false} preventLineNumbers={false} />,
        );
        const content = screen.getByRole("textbox");

        rerender(<CodeEditor name="test-editor" mode="markdown" useToolbar />);
        expect(content).toHaveClass("cm-lineWrapping");
        expect(container.querySelector(".cm-lineNumbers")).not.toBeInTheDocument();

        rerender(<CodeEditor name="test-editor" mode="markdown" />);
        expect(content).not.toHaveClass("cm-lineWrapping");
        expect(container.querySelector(".cm-lineNumbers")).toBeInTheDocument();
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

        const wrapLinesItem = await screen.findByRole("menuitemcheckbox", { name: "wrapLines" });
        expect(wrapLinesItem).toHaveAttribute("aria-checked", "true");
    });

    it("defaults preventLineNumbers to true in markdown mode with toolbar", async () => {
        const { container } = render(<CodeEditor name="test-editor" mode="markdown" useToolbar={true} />);

        fireEvent.click(getConfigMenuOverlay(container));

        const preventLineNumbersItem = await screen.findByRole("menuitemcheckbox", { name: "preventLineNumbers" });
        expect(preventLineNumbersItem).toHaveAttribute("aria-checked", "true");
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

    beforeAll(() => {
        setupDocumentRange();
    });

    it("shows the hint with tab indentation in JSON and releases Tab after Escape", () => {
        const onClose = jest.fn();
        render(
            <SimpleDialog title="Edit code" isOpen onClose={onClose}>
                <CodeEditor data-testid={editorTestId} name="test-editor" mode="json" tabIntentStyle="tab" />
                <button>Next field</button>
            </SimpleDialog>,
        );
        const editor = screen.getByRole("textbox");

        expect(screen.getByTestId(footerTestId)).toBeVisible();

        act(() => editor.focus());

        expect(editor).toHaveFocus();
        expect(screen.getByTestId(footerTestId)).toBeVisible();
        expect(screen.getByText("Press Escape then Tab to leave the editor.")).toHaveAttribute("lang", "en");
        expect(screen.getByTestId(footerTestId).closest(".cm-panels-bottom")).not.toBeNull();
        expect(screen.getByTestId(footerTestId).closest(`.${eccgui}-codeeditor__footer`)).toHaveClass("cm-panel");
        expect(editor).toHaveAccessibleDescription("Press Escape then Tab to leave the editor.");

        expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(false);
        expect(editor).toHaveFocus();
        expect(screen.getByTestId(footerTestId)).toBeVisible();
        const indentedContent = editor.textContent;
        expect(indentedContent).not.toBe("");

        fireEvent.keyDown(editor, { key: "Escape", code: "Escape", keyCode: 27 });
        expect(onClose).not.toHaveBeenCalled();
        expect(editor).toHaveFocus();
        expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(true);
        expect(fireEvent.keyDown(editor, { key: "Tab", keyCode: 9, shiftKey: true })).toBe(true);
        expect(editor.textContent).toBe(indentedContent);

        // jsdom does not perform the browser's native focus navigation for Tab.
        act(() => screen.getByRole("button", { name: "Next field" }).focus());

        expect(editor).not.toHaveFocus();
        fireEvent.keyDown(screen.getByRole("button", { name: "Next field" }), { key: "Escape" });
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId(footerTestId)).toBeVisible();
    });

    it.each([{ readOnly: true }, { disabled: true }, { enableTab: false }])(
        "lets Tab and Escape bubble until the editor captures Tab (%o)",
        (props) => {
            const onKeyDown = jest.fn();
            const renderEditor = (options: Partial<typeof props>) => (
                <div onKeyDown={onKeyDown}>
                    <CodeEditor name="editor" mode="json" {...options} />
                </div>
            );
            const { rerender } = render(renderEditor(props));
            const editor = screen.getByRole("textbox");
            expect(editor).not.toHaveAccessibleDescription();
            expect(fireEvent.keyDown(editor, { key: "Tab", keyCode: 9 })).toBe(true);
            fireEvent.keyDown(editor, { key: "Escape", keyCode: 27 });
            expect(onKeyDown).toHaveBeenCalledTimes(2);

            rerender(renderEditor({}));
            onKeyDown.mockClear();
            fireEvent.keyDown(editor, { key: "Escape", keyCode: 27 });
            expect(onKeyDown).not.toHaveBeenCalled();
            fireEvent.keyDown(editor, { key: "Escape", keyCode: 27, shiftKey: true });
            expect(onKeyDown).toHaveBeenCalledTimes(1);
        },
    );

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

    it("leaves Tab available for focus navigation when enableTab is disabled explicitly", () => {
        render(
            <CodeEditor
                data-testid={editorTestId}
                name="test-editor"
                mode="json"
                tabIntentStyle="tab"
                enableTab={false}
            />,
        );
        const editor = screen.getByRole("textbox");

        act(() => editor.focus());

        expect(screen.queryByTestId(footerTestId)).not.toBeInTheDocument();
        expect(editor).not.toHaveAttribute("aria-describedby");
        expect(fireEvent.keyDown(editor, { key: "Tab", code: "Tab", keyCode: 9 })).toBe(true);
        expect(editor.textContent).toBe("");
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
