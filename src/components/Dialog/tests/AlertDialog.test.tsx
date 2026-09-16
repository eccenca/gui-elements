import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import AlertDialog, { AlertDialogProps } from "../AlertDialog";

const dialogWrapper = `${eccgui}-dialog__wrapper`;

const renderAlert = (props: Partial<AlertDialogProps> = {}) => {
    const { children, ...otherProps } = props;
    const utils = render(
        <AlertDialog isOpen usePortal={false} {...otherProps}>
            {children ?? "alert content"}
        </AlertDialog>,
    );
    const dialog = utils.container.getElementsByClassName(dialogWrapper)[0] as HTMLElement;
    return {
        ...utils,
        dialog,
        card: dialog?.getElementsByClassName(`${eccgui}-card`)[0] as HTMLElement,
        title: dialog?.getElementsByClassName(`${eccgui}-card__title`)[0] as HTMLElement,
        content: dialog?.getElementsByClassName(`${eccgui}-card__content`)[0] as HTMLElement,
    };
};

describe("AlertDialog", () => {
    describe("rendering", () => {
        it("should render its content", () => {
            const { content } = renderAlert();
            expect(content).toHaveTextContent("alert content");
        });
        it("should use the tiny size", () => {
            const { dialog } = renderAlert();
            expect(dialog).toHaveClass(`${dialogWrapper}--tiny`);
        });
        it("should allow to overwrite the size", () => {
            const { dialog } = renderAlert({ size: "large" });
            expect(dialog).toHaveClass(`${dialogWrapper}--large`);
        });
        it("should pass on other dialog properties", () => {
            const { dialog, title } = renderAlert({
                title: "Alert title",
                actions: <button>confirm</button>,
                hasBorder: true,
            });
            expect(title).toHaveTextContent("Alert title");
            expect(dialog.querySelector("footer")).toContainElement(screen.getByText("confirm"));
            expect(dialog.getElementsByClassName(`${eccgui}-separation__divider-horizontal`).length).toBe(2);
        });
    });

    describe("alert level", () => {
        it("should use the `info` intent by default", () => {
            const { card } = renderAlert();
            expect(card).toHaveClass(`${eccgui}-intent--info`);
        });
        it("should use the intent of the set alert level", () => {
            expect(renderAlert({ success: true }).card).toHaveClass(`${eccgui}-intent--success`);
            expect(renderAlert({ warning: true }).card).toHaveClass(`${eccgui}-intent--warning`);
            expect(renderAlert({ danger: true }).card).toHaveClass(`${eccgui}-intent--danger`);
        });
        it("should use the most severe alert level if more than one is set", () => {
            expect(renderAlert({ success: true, warning: true }).card).toHaveClass(`${eccgui}-intent--warning`);
            expect(renderAlert({ warning: true, danger: true }).card).toHaveClass(`${eccgui}-intent--danger`);
            expect(renderAlert({ success: true, warning: true, danger: true }).card).toHaveClass(
                `${eccgui}-intent--danger`,
            );
        });
    });

    describe("aria attributes", () => {
        it("should always use the `alertdialog` role", () => {
            expect(renderAlert().dialog).toHaveAttribute("role", "alertdialog");
            expect(renderAlert({ danger: true }).dialog).toHaveAttribute("role", "alertdialog");
        });
        it("should connect the content via `aria-describedby`", () => {
            const { dialog, content } = renderAlert();
            expect(content.id).toMatch(/^description_/);
            expect(dialog).toHaveAttribute("aria-describedby", content.id);
        });
        it("should use the alert level as `aria-label` fallback if there is neither title nor label", () => {
            expect(renderAlert().dialog).toHaveAttribute("aria-label", "info");
            expect(renderAlert({ warning: true }).dialog).toHaveAttribute("aria-label", "warning");
            expect(renderAlert({ danger: true }).dialog).toHaveAttribute("aria-label", "danger");
        });
        it("should not use the fallback label if a title is given", () => {
            const { dialog, title } = renderAlert({ title: "Alert title" });
            expect(dialog).not.toHaveAttribute("aria-label");
            expect(dialog).toHaveAttribute("aria-labelledby", title.id);
        });
        it("should not use the fallback label if a label is given", () => {
            const { dialog } = renderAlert({ "aria-label": "Alert label" });
            expect(dialog).toHaveAttribute("aria-label", "Alert label");
        });
        it("should not use the fallback label if `aria-labelledby` is given", () => {
            const { dialog } = renderAlert({ "aria-labelledby": "externaltitle" });
            expect(dialog).not.toHaveAttribute("aria-label");
            expect(dialog).toHaveAttribute("aria-labelledby", "externaltitle");
        });
        it("should always have an accessible name, so the role is never removed", () => {
            const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
            expect(renderAlert().dialog).toHaveAttribute("role", "alertdialog");
            expect(consoleWarnSpy).not.toHaveBeenCalled();
            consoleWarnSpy.mockRestore();
        });
    });

    describe("closing behaviour", () => {
        it("should not close on `esc` key or outside click", () => {
            const onClose = jest.fn();
            const { container } = renderAlert({ onClose });
            fireEvent.keyDown(container.getElementsByClassName(dialogWrapper)[0], { key: "Escape" });
            fireEvent.mouseDown(container.getElementsByClassName(`${eccgui}-dialog__backdrop`)[0]);
            expect(onClose).not.toHaveBeenCalled();
        });
        it("should allow to explicitly re-enable closing on `esc` key", () => {
            const onClose = jest.fn();
            const { container } = renderAlert({ onClose, canEscapeKeyClose: true });
            fireEvent.keyDown(container.getElementsByClassName(dialogWrapper)[0], { key: "Escape" });
            expect(onClose).toHaveBeenCalled();
        });
        it("should allow to explicitly re-enable closing on outside click", () => {
            const onClose = jest.fn();
            const { container } = renderAlert({ onClose, canOutsideClickClose: true });
            fireEvent.mouseDown(container.getElementsByClassName(`${eccgui}-dialog__backdrop`)[0]);
            expect(onClose).toHaveBeenCalled();
        });
    });
});
