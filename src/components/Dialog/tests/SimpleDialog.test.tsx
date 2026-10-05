import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { IntentTypes } from "../../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import SimpleDialog, { SimpleDialogProps } from "../SimpleDialog";

const dialogWrapper = `${eccgui}-dialog__wrapper`;

const renderDialog = (props: Partial<SimpleDialogProps> = {}) => {
    const { children, ...otherProps } = props;
    const utils = render(
        <SimpleDialog isOpen usePortal={false} {...otherProps}>
            {children ?? "dialog content"}
        </SimpleDialog>,
    );
    const dialog = utils.container.getElementsByClassName(dialogWrapper)[0] as HTMLElement;
    return {
        ...utils,
        dialog,
        card: dialog?.getElementsByClassName(`${eccgui}-card`)[0] as HTMLElement,
        title: dialog?.getElementsByClassName(`${eccgui}-card__title`)[0] as HTMLElement,
        content: dialog?.getElementsByClassName(`${eccgui}-card__content`)[0] as HTMLElement,
        toggler: dialog?.querySelector(`.${eccgui}-card__options button`) as HTMLElement,
    };
};

describe("SimpleDialog", () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
        // a dialog without an accessible name warns about its removed role, this is asserted separately
        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
    });

    describe("rendering", () => {
        it("should render the content inside a card", () => {
            const { card, content } = renderDialog();
            expect(card).toBeVisible();
            expect(content).toHaveTextContent("dialog content");
        });
        it("should render a header only if there is a title, header options or a toggler", () => {
            const { dialog } = renderDialog();
            expect(dialog.querySelector("header")).toBeNull();

            expect(renderDialog({ title: "My title" }).title).toHaveTextContent("My title");
            expect(renderDialog({ headerOptions: <span>option</span> }).dialog.querySelector("header")).not.toBeNull();
            expect(renderDialog({ showFullScreenToggler: true }).dialog.querySelector("header")).not.toBeNull();
        });
        it("should render actions in a footer", () => {
            const { dialog } = renderDialog({ actions: <button>action button</button> });
            const footer = dialog.querySelector("footer") as HTMLElement;
            expect(footer).toHaveClass(`${eccgui}-card__actions--inversedirection`);
            expect(footer).toContainElement(screen.getByText("action button"));
        });
        it("should forward properties to the actions footer", () => {
            const { dialog } = renderDialog({
                actions: <button>action button</button>,
                actionsProps: { className: "custom-actions" },
            });
            expect(dialog.querySelector("footer")).toHaveClass("custom-actions");
        });
        it("should not render a footer if there are no actions", () => {
            const { dialog } = renderDialog();
            expect(dialog.querySelector("footer")).toBeNull();
        });
        it("should render notifications in an own content area", () => {
            const { dialog } = renderDialog({ notifications: <span>notification</span> });
            const notifications = dialog.getElementsByClassName(`${eccgui}-dialog__notifications`)[0] as HTMLElement;
            expect(notifications).toContainElement(screen.getByText("notification"));
        });
        it("should not render dividers by default", () => {
            const { dialog } = renderDialog({ actions: <button>action button</button> });
            expect(dialog.getElementsByClassName(`${eccgui}-separation__divider-horizontal`).length).toBe(0);
        });
        it("should render dividers around the content if `hasBorder` is set", () => {
            const { dialog } = renderDialog({ hasBorder: true, actions: <button>action button</button> });
            expect(dialog.getElementsByClassName(`${eccgui}-separation__divider-horizontal`).length).toBe(2);
        });
        it("should use a fallback test id", () => {
            const { container } = renderDialog();
            expect(container.querySelector("[data-test-id='simpleDialogWidget']")).not.toBeNull();
        });
        it("should use a given test id", () => {
            const { container } = renderDialog({ "data-test-id": "myDialog" });
            expect(container.querySelector("[data-test-id='myDialog']")).not.toBeNull();
        });
    });

    describe("intent state", () => {
        it("should not add any intent class name by default", () => {
            const { card } = renderDialog();
            expect(card.className).not.toContain(`${eccgui}-intent--`);
        });
        it("should add the intent class name to card, title and actions", () => {
            const { card, title, dialog } = renderDialog({
                intent: "warning",
                title: "My title",
                actions: <button>action button</button>,
            });
            expect(card).toHaveClass(`${eccgui}-intent--warning`);
            expect(title).toHaveClass(`${eccgui}-intent--warning`);
            expect(dialog.querySelector("footer")).toHaveClass(`${eccgui}-intent--warning`);
        });
    });

    describe("aria attributes", () => {
        it("should use the `dialog` role if there is no alert intent state", () => {
            const { dialog } = renderDialog({ title: "My title" });
            expect(dialog).toHaveAttribute("role", "dialog");
        });
        it("should use the `alertdialog` role if an intent state is set", () => {
            const { dialog } = renderDialog({ intent: "danger" });
            expect(dialog).toHaveAttribute("role", "alertdialog");
        });
        it("should use a given role", () => {
            expect(renderDialog({ role: "dialog", intent: "danger" }).dialog).toHaveAttribute("role", "dialog");
            expect(renderDialog({ role: "alertdialog", title: "My title" }).dialog).toHaveAttribute(
                "role",
                "alertdialog",
            );
        });
        it("should remove the role if there is neither title, label nor alert intent state", () => {
            const { dialog } = renderDialog();
            expect(dialog).not.toHaveAttribute("role");
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("removed from modal"));
        });
        it("should keep the `dialog` role if only a label is given", () => {
            const { dialog } = renderDialog({ "aria-label": "Dialog label" });
            expect(dialog).toHaveAttribute("role", "dialog");
        });
        it("should connect the title to the dialog via `aria-labelledby`", () => {
            const { dialog, title } = renderDialog({ title: "My title" });
            expect(title.id).toMatch(/^title_/);
            expect(dialog).toHaveAttribute("aria-labelledby", title.id);
        });
        it("should not set `aria-labelledby` if there is no title", () => {
            const { dialog, content } = renderDialog();
            expect(dialog).not.toHaveAttribute("aria-labelledby");
            expect(content.id).toBe("");
        });
        it("should use a given `aria-labelledby`", () => {
            const { dialog } = renderDialog({ title: "My title", "aria-labelledby": "customtitle" });
            expect(dialog).toHaveAttribute("aria-labelledby", "customtitle");
        });
        it("should connect the content to the dialog via `aria-describedby` if an intent state is set", () => {
            const { dialog, content } = renderDialog({ intent: "info" });
            expect(content.id).toMatch(/^description_/);
            expect(dialog).toHaveAttribute("aria-describedby", content.id);
        });
        it("should not set `aria-describedby` if there is no intent state", () => {
            const { dialog, content } = renderDialog({ title: "My title" });
            expect(dialog).not.toHaveAttribute("aria-describedby");
            expect(content.id).toBe("");
        });
        it("should use a given `aria-describedby`", () => {
            const { dialog } = renderDialog({ intent: "info", "aria-describedby": "customdescription" });
            expect(dialog).toHaveAttribute("aria-describedby", "customdescription");
        });
        it("should forward a given `aria-label`", () => {
            const { dialog } = renderDialog({ "aria-label": "Dialog label" });
            expect(dialog).toHaveAttribute("aria-label", "Dialog label");
        });
        it("should use alert semantics for each alert intent state", () => {
            (["success", "warning", "danger", "info"] as IntentTypes[]).forEach((intent) => {
                const { dialog, content } = renderDialog({ intent, title: "My title" });
                expect(dialog).toHaveAttribute("role", "alertdialog");
                expect(content.id).toMatch(/^description_/);
                expect(dialog).toHaveAttribute("aria-describedby", content.id);
            });
        });
        it("should not use alert semantics for intent states that describe no alert", () => {
            (["none", "primary", "accent", "neutral"] as IntentTypes[]).forEach((intent) => {
                const { dialog, card, content } = renderDialog({ intent, title: "My title" });
                expect(dialog).toHaveAttribute("role", "dialog");
                expect(dialog).not.toHaveAttribute("aria-describedby");
                expect(content.id).toBe("");
                // the intent is still displayed, it only carries no alert semantics
                expect(card).toHaveClass(`${eccgui}-intent--${intent}`);
            });
        });
        it("should create unique IDs for each dialog", () => {
            const { container } = render(
                <>
                    <SimpleDialog isOpen usePortal={false} title="first" intent="info">
                        first content
                    </SimpleDialog>
                    <SimpleDialog isOpen usePortal={false} title="second" intent="info">
                        second content
                    </SimpleDialog>
                </>,
            );
            const [first, second] = Array.from(container.getElementsByClassName(dialogWrapper)) as HTMLElement[];
            expect(first.getAttribute("aria-labelledby")).not.toBe(second.getAttribute("aria-labelledby"));
            expect(first.getAttribute("aria-describedby")).not.toBe(second.getAttribute("aria-describedby"));
        });
    });

    describe("full screen mode", () => {
        it("should not show a toggler by default", () => {
            const { toggler } = renderDialog({ title: "My title" });
            expect(toggler).toBeNull();
        });
        it("should switch to full screen mode by using the toggler", () => {
            const { dialog, toggler } = renderDialog({ showFullScreenToggler: true, size: "small" });
            expect(dialog).toHaveClass(`${dialogWrapper}--small`);

            fireEvent.click(toggler);
            expect(dialog).toHaveClass(`${dialogWrapper}--fullscreen`);

            fireEvent.click(toggler);
            expect(dialog).toHaveClass(`${dialogWrapper}--small`);
        });
        it("should start in full screen mode and enable the toggler", () => {
            const { dialog, toggler } = renderDialog({ startInFullScreenMode: true, size: "small" });
            expect(dialog).toHaveClass(`${dialogWrapper}--fullscreen`);
            expect(toggler).not.toBeNull();

            fireEvent.click(toggler);
            expect(dialog).toHaveClass(`${dialogWrapper}--small`);
        });
        it("should display header options beside the toggler", () => {
            const { dialog } = renderDialog({
                showFullScreenToggler: true,
                headerOptions: <span>option</span>,
            });
            const options = dialog.getElementsByClassName(`${eccgui}-card__options`)[0] as HTMLElement;
            expect(options).toContainElement(screen.getByText("option"));
            expect(options.querySelectorAll("button").length).toBe(1);
        });
    });

    describe("closing behaviour", () => {
        it("should close on `esc` key and outside click by default", () => {
            const onClose = jest.fn();
            const { container } = renderDialog({ onClose });
            fireEvent.keyDown(container.getElementsByClassName(dialogWrapper)[0], { key: "Escape" });
            expect(onClose).toHaveBeenCalled();

            onClose.mockClear();
            fireEvent.mouseDown(container.getElementsByClassName(`${eccgui}-dialog__backdrop`)[0]);
            expect(onClose).toHaveBeenCalled();
        });
        it("should not close on `esc` key or outside click if `preventSimpleClosing` is set", () => {
            const onClose = jest.fn();
            const { container } = renderDialog({ onClose, preventSimpleClosing: true });
            fireEvent.keyDown(container.getElementsByClassName(dialogWrapper)[0], { key: "Escape" });
            fireEvent.mouseDown(container.getElementsByClassName(`${eccgui}-dialog__backdrop`)[0]);
            expect(onClose).not.toHaveBeenCalled();
        });
        it("should allow to explicitly re-enable closing on `esc` key", () => {
            const onClose = jest.fn();
            const { container } = renderDialog({ onClose, preventSimpleClosing: true, canEscapeKeyClose: true });
            fireEvent.keyDown(container.getElementsByClassName(dialogWrapper)[0], { key: "Escape" });
            expect(onClose).toHaveBeenCalled();
        });
        it("should allow to explicitly re-enable closing on outside click", () => {
            const onClose = jest.fn();
            const { container } = renderDialog({ onClose, preventSimpleClosing: true, canOutsideClickClose: true });
            fireEvent.mouseDown(container.getElementsByClassName(`${eccgui}-dialog__backdrop`)[0]);
            expect(onClose).toHaveBeenCalled();
        });
    });

    describe("event prevention", () => {
        it("should prevent that certain events bubble up from the dialog", () => {
            const onClick = jest.fn();
            const onContextMenu = jest.fn();
            const { container } = render(
                <div onClick={onClick} onContextMenu={onContextMenu}>
                    <SimpleDialog isOpen usePortal={false} title="My title">
                        dialog content
                    </SimpleDialog>
                </div>,
            );
            const content = container.getElementsByClassName(`${eccgui}-card__content`)[0] as HTMLElement;
            fireEvent.click(content);
            fireEvent.contextMenu(content);
            expect(onClick).not.toHaveBeenCalled();
            expect(onContextMenu).not.toHaveBeenCalled();
        });
        it("should keep given properties of the modal wrapper div element", () => {
            const onMouseEnter = jest.fn();
            const { container } = renderDialog({ wrapperDivProps: { onMouseEnter } });
            fireEvent.mouseEnter(container.getElementsByClassName("bp6-dialog-container")[0]);
            expect(onMouseEnter).toHaveBeenCalled();
        });
    });
});
