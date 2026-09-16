import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { Card, CardContent } from "../../Card";
import Modal, { ModalProps } from "../Modal";
import { ModalContext, ModalContextProps, useModalContext } from "../ModalContext";

const dialogWrapper = `${eccgui}-dialog__wrapper`;

const renderModal = (props: Partial<ModalProps> = {}) => {
    const { children, ...otherProps } = props;
    const utils = render(
        <Modal isOpen usePortal={false} {...otherProps}>
            {children ?? "modal content"}
        </Modal>,
    );
    return {
        ...utils,
        modal: utils.container.getElementsByClassName(dialogWrapper)[0] as HTMLElement,
    };
};

describe("Modal", () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
        // a modal without an accessible name warns about its removed role, this is asserted separately
        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
    });

    describe("rendering", () => {
        it("should not render anything if it is not open", () => {
            const { container } = renderModal({ isOpen: false });
            expect(container.getElementsByClassName(dialogWrapper).length).toBe(0);
            expect(screen.queryByText("modal content")).toBeNull();
        });
        it("should render its children if it is open", () => {
            const { modal } = renderModal();
            expect(modal).toBeVisible();
            expect(screen.getByText("modal content")).toBeVisible();
        });
        it("should use the regular size by default", () => {
            const { modal } = renderModal();
            expect(modal).toHaveClass(`${dialogWrapper}--regular`);
        });
        it("should use the given size", () => {
            const { modal } = renderModal({ size: "fullscreen" });
            expect(modal).toHaveClass(`${dialogWrapper}--fullscreen`);
        });
        it("should add a given class name to the modal wrapper", () => {
            const { modal } = renderModal({ className: "custom-modal" });
            expect(modal).toHaveClass(dialogWrapper, "custom-modal");
        });
        it("should add a given overlay class name to the overlay element", () => {
            const { container } = renderModal({ overlayClassName: "custom-overlay" });
            expect(container.getElementsByClassName("custom-overlay").length).toBe(1);
        });
        it("should display a backdrop by default", () => {
            const { container } = renderModal();
            expect(container.getElementsByClassName(`${eccgui}-dialog__backdrop`).length).toBe(1);
        });
        it("should not display a backdrop if `preventBackdrop` is set", () => {
            const { container } = renderModal({ preventBackdrop: true });
            expect(container.getElementsByClassName(`${eccgui}-dialog__backdrop`).length).toBe(0);
        });
        it("should use a `Card` child only as layout element with a raised elevation", () => {
            const { modal } = renderModal({
                children: (
                    <Card>
                        <CardContent>card content</CardContent>
                    </Card>
                ),
            });
            const card = modal.getElementsByClassName(`${eccgui}-card`)[0] as HTMLElement;
            // `isOnlyLayout` prevents the additional `section` wrapper around the card
            expect(card.parentElement).toBe(modal);
            expect(card).toHaveClass("bp6-elevation-4");
        });
        it("should not alter children that are no `Card` elements", () => {
            const { modal } = renderModal({ children: <div data-testid="plain">plain child</div> });
            expect(modal.querySelector("[data-testid='plain']")).not.toBeNull();
        });
        it("should forward properties to the wrapper div element", () => {
            const { container } = renderModal({ wrapperDivProps: { title: "wrapper title" } });
            const wrapper = container.querySelector("[title='wrapper title']") as HTMLElement;
            expect(wrapper).not.toBeNull();
            expect(wrapper.getElementsByClassName(dialogWrapper).length).toBe(1);
        });
    });

    describe("test ids", () => {
        it("should use a fallback test id because it cannot be routed through the overlay", () => {
            const { container } = renderModal();
            expect(container.querySelector("[data-test-id='simpleDialogWidget']")).not.toBeNull();
        });
        it("should use the given test ids", () => {
            const { container } = renderModal({ "data-test-id": "myModal", "data-testid": "myModalTestid" });
            expect(container.querySelector("[data-test-id='myModal']")).not.toBeNull();
            expect(container.querySelector("[data-testid='myModalTestid']")).not.toBeNull();
        });
    });

    describe("aria attributes", () => {
        it("should use the `dialog` role by default", () => {
            const { modal } = renderModal({ "aria-label": "Modal label" });
            expect(modal.tagName).toBe("SECTION");
            expect(modal).toHaveAttribute("role", "dialog");
        });
        it("should use a given role", () => {
            const { modal } = renderModal({ role: "alertdialog", "aria-label": "Modal label" });
            expect(modal).toHaveAttribute("role", "alertdialog");
        });
        it("should not set any label or description attribute automatically", () => {
            const { modal } = renderModal();
            expect(modal).not.toHaveAttribute("aria-label");
            expect(modal).not.toHaveAttribute("aria-labelledby");
            expect(modal).not.toHaveAttribute("aria-describedby");
        });
        it("should set given label and description attributes on the modal element", () => {
            const { modal } = renderModal({
                "aria-label": "Modal label",
                "aria-labelledby": "customtitle",
                "aria-describedby": "customdescription",
            });
            expect(modal).toHaveAttribute("aria-label", "Modal label");
            expect(modal).toHaveAttribute("aria-labelledby", "customtitle");
            expect(modal).toHaveAttribute("aria-describedby", "customdescription");
        });
        it("should remove the role if there is neither a label nor a description", () => {
            const { modal } = renderModal();
            expect(modal).not.toHaveAttribute("role");
        });
        it("should also remove an explicitly given role if there is no label or description", () => {
            const { modal } = renderModal({ role: "alertdialog" });
            expect(modal).not.toHaveAttribute("role");
        });
        it("should keep the role if any label or description is available", () => {
            expect(renderModal({ "aria-label": "Modal label" }).modal).toHaveAttribute("role", "dialog");
            expect(renderModal({ "aria-labelledby": "customtitle" }).modal).toHaveAttribute("role", "dialog");
            expect(renderModal({ "aria-describedby": "customdescription" }).modal).toHaveAttribute("role", "dialog");
        });
        it("should warn about a removed role", () => {
            renderModal({ role: "alertdialog" });
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("role=alertdialog removed"));
        });
        it("should not warn if the modal has an accessible name", () => {
            renderModal({ "aria-label": "Modal label" });
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });
    });

    describe("focus and closing behaviour", () => {
        it("should be focusable by default", () => {
            const { container } = renderModal();
            const wrapper = container.getElementsByClassName("bp6-dialog-container")[0] as HTMLElement;
            expect(wrapper).toHaveAttribute("tabindex", "0");
        });
        it("should not close on `esc` key or outside click by default", () => {
            const onClose = jest.fn();
            const { container } = renderModal({ onClose });
            fireEvent.keyDown(container.getElementsByClassName(dialogWrapper)[0], { key: "Escape" });
            fireEvent.mouseDown(container.getElementsByClassName(`${eccgui}-dialog__backdrop`)[0]);
            expect(onClose).not.toHaveBeenCalled();
        });
        it("should close on `esc` key if `canEscapeKeyClose` is set", () => {
            const onClose = jest.fn();
            const { container } = renderModal({ onClose, canEscapeKeyClose: true });
            fireEvent.keyDown(container.getElementsByClassName(dialogWrapper)[0], { key: "Escape" });
            expect(onClose).toHaveBeenCalled();
        });
        it("should close on outside click if `canOutsideClickClose` is set", () => {
            const onClose = jest.fn();
            const { container } = renderModal({ onClose, canOutsideClickClose: true });
            fireEvent.mouseDown(container.getElementsByClassName(`${eccgui}-dialog__backdrop`)[0]);
            expect(onClose).toHaveBeenCalled();
        });
        it("should make the backdrop focusable if only the `esc` key can close the modal", () => {
            const { container } = renderModal({ canEscapeKeyClose: true, canOutsideClickClose: false });
            const backdrop = container.getElementsByClassName(`${eccgui}-dialog__backdrop`)[0] as HTMLElement;
            expect(backdrop).toHaveAttribute("tabindex", "0");
        });
    });

    describe("react-flow event prevention", () => {
        it("should prevent react-flow events by default", () => {
            const { container } = renderModal();
            const overlay = container.firstElementChild as HTMLElement;
            expect(overlay).toHaveClass("nodrag", "nopan", "nowheel");
        });
        it("should not prevent react-flow events if switched off", () => {
            const { container } = renderModal({ preventReactFlowEvents: false });
            const overlay = container.firstElementChild as HTMLElement;
            expect(overlay).not.toHaveClass("nodrag");
        });
    });

    describe("event handler", () => {
        it("should still call a given `onOpening` handler", () => {
            const onOpening = jest.fn();
            renderModal({ onOpening });
            expect(onOpening).toHaveBeenCalledTimes(1);
        });
    });

    describe("modality", () => {
        const TrackedModals = ({ children }: { children: React.ReactNode }) => {
            const modalContext = useModalContext();
            return <ModalContext.Provider value={modalContext}>{children}</ModalContext.Provider>;
        };

        it("should not claim modality if no modal context is provided", () => {
            const { modal } = renderModal({ "aria-label": "Modal label" });
            expect(modal).toHaveAttribute("aria-modal", "false");
        });
        it("should claim modality for the only open modal", () => {
            const { container } = render(
                <TrackedModals>
                    <Modal isOpen usePortal={false} modalId="only" aria-label="only">
                        only content
                    </Modal>
                </TrackedModals>,
            );
            const modal = container.getElementsByClassName(dialogWrapper)[0] as HTMLElement;
            expect(modal).toHaveAttribute("aria-modal", "true");
        });
        it("should claim modality only for the modal that was opened last", () => {
            const { container } = render(
                <TrackedModals>
                    <Modal isOpen usePortal={false} modalId="below" aria-label="below">
                        below content
                    </Modal>
                    <Modal isOpen usePortal={false} modalId="ontop" aria-label="ontop">
                        content on top
                    </Modal>
                </TrackedModals>,
            );
            const modalBelow = container.querySelector(`.${dialogWrapper}[aria-label='below']`) as HTMLElement;
            const modalOnTop = container.querySelector(`.${dialogWrapper}[aria-label='ontop']`) as HTMLElement;
            expect(modalOnTop).toHaveAttribute("aria-modal", "true");
            expect(modalBelow).toHaveAttribute("aria-modal", "false");
        });
        it("should hand over modality to a modal that is opened on top", () => {
            const modalStack = (secondOpen: boolean) => (
                <TrackedModals>
                    <Modal isOpen usePortal={false} modalId="below" aria-label="below">
                        below content
                    </Modal>
                    <Modal isOpen={secondOpen} usePortal={false} modalId="ontop" aria-label="ontop">
                        content on top
                    </Modal>
                </TrackedModals>
            );
            const { container, rerender } = render(modalStack(false));
            const modalBelow = container.querySelector(`.${dialogWrapper}[aria-label='below']`) as HTMLElement;
            expect(modalBelow).toHaveAttribute("aria-modal", "true");

            rerender(modalStack(true));
            const modalOnTop = container.querySelector(`.${dialogWrapper}[aria-label='ontop']`) as HTMLElement;
            expect(modalOnTop).toHaveAttribute("aria-modal", "true");
            expect(modalBelow).toHaveAttribute("aria-modal", "false");
        });
        it("should not claim modality if the role was removed", () => {
            const { container } = render(
                <TrackedModals>
                    <Modal isOpen usePortal={false} modalId="nameless">
                        content without any label
                    </Modal>
                </TrackedModals>,
            );
            const modal = container.getElementsByClassName(dialogWrapper)[0] as HTMLElement;
            expect(modal).not.toHaveAttribute("role");
            expect(modal).not.toHaveAttribute("aria-modal");
        });
    });

    describe("modal context", () => {
        const renderWithContext = (props: Partial<ModalProps> = {}) => {
            const setModalOpen = jest.fn();
            const modalContext: ModalContextProps = { setModalOpen, openModalStack: () => [] };
            const { unmount, rerender } = render(
                <ModalContext.Provider value={modalContext}>
                    <Modal isOpen usePortal={false} modalId="testmodal" {...props}>
                        modal content
                    </Modal>
                </ModalContext.Provider>,
            );
            const rerenderModal = (newProps: Partial<ModalProps>) =>
                rerender(
                    <ModalContext.Provider value={modalContext}>
                        <Modal isOpen usePortal={false} modalId="testmodal" {...props} {...newProps}>
                            modal content
                        </Modal>
                    </ModalContext.Provider>,
                );
            return { setModalOpen, unmount, rerender: rerenderModal };
        };

        it("should register the open state of the modal", () => {
            const { setModalOpen } = renderWithContext();
            expect(setModalOpen).toHaveBeenCalledWith("testmodal", true);
        });
        it("should register a state change of the modal", () => {
            const { setModalOpen, rerender } = renderWithContext();
            setModalOpen.mockClear();
            rerender({ isOpen: false });
            expect(setModalOpen).toHaveBeenCalledWith("testmodal", false);
        });
        it("should register the modal as closed when it is removed", () => {
            const { setModalOpen, unmount } = renderWithContext();
            setModalOpen.mockClear();
            unmount();
            expect(setModalOpen).toHaveBeenCalledWith("testmodal", false);
        });
        it("should create a unique modal ID if none is given", () => {
            const setModalOpen = jest.fn();
            const modalContext: ModalContextProps = { setModalOpen, openModalStack: () => [] };
            render(
                <ModalContext.Provider value={modalContext}>
                    <Modal isOpen usePortal={false}>
                        first
                    </Modal>
                    <Modal isOpen usePortal={false}>
                        second
                    </Modal>
                </ModalContext.Provider>,
            );
            const registeredIds = setModalOpen.mock.calls.map(([modalId]) => modalId);
            expect(registeredIds[0]).not.toBe(registeredIds[1]);
        });
    });
});
