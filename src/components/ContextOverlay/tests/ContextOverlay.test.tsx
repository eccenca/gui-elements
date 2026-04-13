import React from "react";
import { PopoverInteractionKind } from "@blueprintjs/core";
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
            />
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
            />
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
