/**
 * Smoke tests for the Radix based Dialog family, guarding the behavior contract of the former
 * BlueprintJS implementation: class name contract (`__portal`, `__backdrop`, `__container`,
 * `__wrapper`), close paths (backdrop, Escape, `preventSimpleClosing`), scroll lock, modal
 * tracking via `ModalContext`, nested modal portaling and the lifecycle callbacks.
 */
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { ModalContext, useModalContext } from "../ModalContext";
import { Modal } from "../Modal";
import { modalPreventEvents, SimpleDialog } from "../SimpleDialog";
import { AlertDialog } from "../AlertDialog";

describe("Dialog family (Radix rebuild)", () => {
    it("renders SimpleDialog content with the portal/backdrop/container/wrapper class name contract", () => {
        render(
            <SimpleDialog isOpen title="Test title" size="large" data-test-id="my-dialog">
                <span>dialog body</span>
            </SimpleDialog>,
        );
        expect(screen.getByText("dialog body")).toBeTruthy();
        expect(screen.getByText("Test title")).toBeTruthy();
        const portal = document.querySelector(`.${eccgui}-dialog__portal`) as HTMLElement;
        expect(portal).toBeTruthy();
        expect(portal.style.zIndex).toBe(`var(--${eccgui}-zindex-modals)`);
        expect(portal.parentElement).toBe(document.body);
        expect(document.querySelector(`.${eccgui}-dialog__backdrop`)).toBeTruthy();
        const container = document.querySelector(`.${eccgui}-dialog__container`) as HTMLElement;
        expect(container).toBeTruthy();
        expect(container.getAttribute("data-test-id")).toBe("my-dialog");
        expect(container.tabIndex).toBe(0);
        const wrapper = document.querySelector(`.${eccgui}-dialog__wrapper`) as HTMLElement;
        expect(wrapper).toBeTruthy();
        expect(wrapper.classList.contains(`${eccgui}-dialog__wrapper--large`)).toBe(true);
        expect(wrapper.tagName).toBe("SECTION");
        // container element is inside the portal element
        expect(portal.contains(container)).toBe(true);
    });

    it("uses the default test id and renders nothing when closed", () => {
        const { rerender } = render(
            <SimpleDialog isOpen={false} title="hidden">
                <span>hidden body</span>
            </SimpleDialog>,
        );
        expect(screen.queryByText("hidden body")).toBeNull();
        expect(document.querySelector(`.${eccgui}-dialog__portal`)).toBeNull();
        rerender(
            <SimpleDialog isOpen title="hidden">
                <span>hidden body</span>
            </SimpleDialog>,
        );
        expect(screen.getByText("hidden body")).toBeTruthy();
        expect(
            (document.querySelector(`.${eccgui}-dialog__container`) as HTMLElement).getAttribute("data-test-id"),
        ).toBe("simpleDialogWidget");
    });

    it("fires onClose on backdrop mouse down when closable (SimpleDialog default)", () => {
        const onClose = jest.fn();
        render(
            <SimpleDialog isOpen title="closable" onClose={onClose}>
                content
            </SimpleDialog>,
        );
        fireEvent.mouseDown(document.querySelector(`.${eccgui}-dialog__backdrop`) as HTMLElement);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not fire onClose on backdrop mouse down or Escape with preventSimpleClosing", () => {
        const onClose = jest.fn();
        render(
            <SimpleDialog isOpen title="locked" preventSimpleClosing onClose={onClose}>
                <button>inner</button>
            </SimpleDialog>,
        );
        fireEvent.mouseDown(document.querySelector(`.${eccgui}-dialog__backdrop`) as HTMLElement);
        fireEvent.keyDown(screen.getByText("inner"), { key: "Escape" });
        expect(onClose).not.toHaveBeenCalled();
    });

    it("fires onClose on Escape when closable", () => {
        const onClose = jest.fn();
        render(
            <SimpleDialog isOpen title="esc" onClose={onClose}>
                <button>inner</button>
            </SimpleDialog>,
        );
        fireEvent.keyDown(screen.getByText("inner"), { key: "Escape" });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("locks body scroll while open and unlocks after unmount", () => {
        const { unmount } = render(
            <SimpleDialog isOpen title="scroll">
                content
            </SimpleDialog>,
        );
        expect(document.body.style.overflow).toBe("hidden");
        unmount();
        expect(document.body.style.overflow).toBe("");
    });

    it("omits the backdrop with preventBackdrop and closes on outside document mouse down", () => {
        const onClose = jest.fn();
        render(
            <div>
                <button>outside</button>
                <Modal isOpen preventBackdrop canOutsideClickClose onClose={onClose}>
                    <div>bare modal</div>
                </Modal>
            </div>,
        );
        expect(document.querySelector(`.${eccgui}-dialog__backdrop`)).toBeNull();
        fireEvent.mouseDown(screen.getByText("outside"));
        expect(onClose).toHaveBeenCalledTimes(1);
        // clicking inside must not close
        fireEvent.mouseDown(screen.getByText("bare modal"));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("tracks open modals via ModalContext (open + close + unmount)", async () => {
        const stackStates: (string[] | undefined)[] = [];
        const Harness = ({ open, mount = true }: { open: boolean; mount?: boolean }) => {
            const context = useModalContext();
            stackStates.push(context.openModalStack());
            return (
                <ModalContext.Provider value={context}>
                    {mount && (
                        <Modal isOpen={open} modalId="test-modal">
                            <div>tracked</div>
                        </Modal>
                    )}
                    <button onClick={() => stackStates.push(context.openModalStack())}>probe</button>
                </ModalContext.Provider>
            );
        };
        const { rerender } = render(<Harness open />);
        fireEvent.click(screen.getByText("probe"));
        expect(stackStates[stackStates.length - 1]).toEqual(["test-modal"]);
        rerender(<Harness open={false} />);
        await waitFor(() => expect(screen.queryByText("tracked")).toBeNull());
        fireEvent.click(screen.getByText("probe"));
        expect(stackStates[stackStates.length - 1]).toBeUndefined();
    });

    it("renders inline (usePortal={false}) without a portal element", () => {
        render(
            <Modal isOpen usePortal={false}>
                <div>inline modal</div>
            </Modal>,
        );
        expect(screen.getByText("inline modal")).toBeTruthy();
        expect(document.querySelector(`.${eccgui}-dialog__portal`)).toBeNull();
        expect(document.querySelector(`.${eccgui}-dialog__wrapper`)).toBeTruthy();
    });

    it("nests a modal into an open modal via the overlay parent context", () => {
        render(
            <Modal isOpen modalId="outer">
                <div>
                    outer content
                    <Modal isOpen modalId="inner">
                        <div>inner content</div>
                    </Modal>
                </div>
            </Modal>,
        );
        const wrappers = document.querySelectorAll(`.${eccgui}-dialog__wrapper`);
        expect(wrappers.length).toBe(2);
        const outerWrapper = wrappers[0] as HTMLElement;
        const innerPortal = outerWrapper.querySelector(`.${eccgui}-dialog__portal`);
        // the inner modal's portal element mounts INSIDE the outer modal's wrapper element
        expect(innerPortal).toBeTruthy();
        expect(innerPortal!.textContent).toContain("inner content");
    });

    it("keeps AlertDialog closable only via actions and applies the intent class", () => {
        const onClose = jest.fn();
        render(
            <AlertDialog isOpen warning onClose={onClose} title="alert!">
                alert content
            </AlertDialog>,
        );
        expect(screen.getByText("alert content")).toBeTruthy();
        // AlertDialog sets preventSimpleClosing
        fireEvent.mouseDown(document.querySelector(`.${eccgui}-dialog__backdrop`) as HTMLElement);
        expect(onClose).not.toHaveBeenCalled();
        expect(document.querySelector(`.${eccgui}-intent--warning`)).toBeTruthy();
    });

    it("still exports modalPreventEvents with the expected handlers", () => {
        expect(Object.keys(modalPreventEvents).sort()).toEqual(
            ["onClick", "onContextMenu", "onDrag", "onDragEnd", "onDragStart", "onMouseUp"].sort(),
        );
    });

    it("fires lifecycle callbacks (onOpening/onOpened/onClosing/onClosed) with an element", async () => {
        jest.useFakeTimers();
        try {
            const onOpening = jest.fn();
            const onOpened = jest.fn();
            const onClosing = jest.fn();
            const onClosed = jest.fn();
            const { rerender } = render(
                <Modal
                    isOpen
                    onOpening={onOpening}
                    onOpened={onOpened}
                    onClosing={onClosing}
                    onClosed={onClosed}
                    transitionDuration={50}
                >
                    <div>lifecycle</div>
                </Modal>,
            );
            expect(onOpening).toHaveBeenCalledTimes(1);
            expect(onOpening.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
            jest.advanceTimersByTime(60);
            expect(onOpened).toHaveBeenCalledTimes(1);
            rerender(
                <Modal
                    isOpen={false}
                    onOpening={onOpening}
                    onOpened={onOpened}
                    onClosing={onClosing}
                    onClosed={onClosed}
                    transitionDuration={50}
                >
                    <div>lifecycle</div>
                </Modal>,
            );
            expect(onClosing).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(60);
            expect(onClosed).toHaveBeenCalledTimes(1);
        } finally {
            jest.useRealTimers();
        }
    });
});
