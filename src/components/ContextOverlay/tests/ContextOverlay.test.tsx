import React from "react";
import { PopoverInteractionKind, PopupKind } from "@blueprintjs/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

import ContextOverlay from "./../ContextOverlay";
import { Default as ContextOverlayStory } from "./../ContextOverlay.stories";

const overlayWrapper = `${eccgui}-contextoverlay`;
const placeholderClass = `${overlayWrapper}__wrapper--placeholder`;

const checkForPlaceholderClass = (container: HTMLElement, tobe: number) => {
    expect(container.getElementsByClassName(placeholderClass).length).toBe(tobe);
};

describe("ContextOverlay", () => {
    it("does not announce generic attached content as a menu", () => {
        render(
            <ContextOverlay content={<p>Attached information</p>}>
                <button>Show information</button>
            </ContextOverlay>,
        );
        expect(screen.getByRole("button", { name: "Show information" })).toHaveAttribute("aria-haspopup", "false");
    });

    it.each([PopupKind.MENU, PopupKind.LISTBOX, PopupKind.DIALOG])(
        "announces an explicit %s before and after replacing the placeholder",
        async (popupKind) => {
            render(
                <ContextOverlay usePlaceholder popupKind={popupKind} content={<div role={popupKind}>Popup</div>}>
                    <button>Open popup</button>
                </ContextOverlay>,
            );
            expect(screen.getByRole("button", { name: "Open popup" })).toHaveAttribute("aria-haspopup", popupKind);
            fireEvent.click(screen.getByRole("button", { name: "Open popup" }));
            expect(await screen.findByText("Popup")).toBeVisible();
            expect(screen.getByRole("button", { name: "Open popup" })).toHaveAttribute("aria-haspopup", popupKind);
        },
    );

    it("does not advertise a menu to a custom target renderer", () => {
        render(
            <ContextOverlay
                content={<p>Attached information</p>}
                renderTarget={({ isOpen, ...targetProps }) => <button {...targetProps}>Show information</button>}
            />,
        );
        expect(screen.getByRole("button", { name: "Show information" })).toHaveAttribute("aria-haspopup", "false");
    });

    it("should not render placeholder automatically", () => {
        const { container } = render(<ContextOverlay {...ContextOverlayStory.args} />);
        checkForPlaceholderClass(container, 0);
    });
    it("should render placeholder when `usePlaceholder===true`", () => {
        const { container } = render(<ContextOverlay {...ContextOverlayStory.args} usePlaceholder={true} />);
        checkForPlaceholderClass(container, 1);
    });
    it("should render no placeholder when `usePlaceholder===false`", () => {
        const { container } = render(<ContextOverlay {...ContextOverlayStory.args} usePlaceholder={false} />);
        checkForPlaceholderClass(container, 0);
    });
    it("if no placeholder is used the overlay should be displayed on click", async () => {
        const { container } = render(<ContextOverlay {...ContextOverlayStory.args} usePlaceholder={false} />);
        fireEvent.click(container.getElementsByClassName(overlayWrapper)[0]);
        expect(await screen.findByText("Overlay:")).toBeVisible();
    });
    it("if no placeholder is used the overlay should be displayed on hover (hover interactionKind)", async () => {
        const { container } = render(
            <ContextOverlay
                {...ContextOverlayStory.args}
                usePlaceholder={false}
                interactionKind={PopoverInteractionKind.HOVER}
            />,
        );
        fireEvent.mouseEnter(container.getElementsByClassName(overlayWrapper)[0]);
        expect(await screen.findByText("Overlay:")).toBeVisible();
    });
    it("if placeholder is used the overlay should be displayed on click", async () => {
        const { container } = render(<ContextOverlay {...ContextOverlayStory.args} usePlaceholder={true} />);
        fireEvent.click(container.getElementsByClassName(overlayWrapper)[0]);
        expect(await screen.findByText("Overlay:")).toBeVisible();
    });
    it("if placeholder is used the overlay should be displayed on hover (hover interactionKind)", async () => {
        const { container } = render(
            <ContextOverlay
                {...ContextOverlayStory.args}
                usePlaceholder={true}
                interactionKind={PopoverInteractionKind.HOVER}
            />,
        );
        checkForPlaceholderClass(container, 1);
        fireEvent.mouseEnter(container.getElementsByClassName(overlayWrapper)[0]);
        await waitFor(async () => {
            expect(screen.queryByDisplayValue("Overlay:")).toBeNull();
            checkForPlaceholderClass(container, 0);
            // we need to emulate another mouseover to simulate real user behaviour
            fireEvent.mouseOver(container.getElementsByClassName(overlayWrapper)[0]);
            expect(await screen.findByText("Overlay:")).toBeVisible();
        });
    });
});
