import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import Tooltip from "./Tooltip";
import { Default as TooltipStory } from "./Tooltip.stories";

const checkForPlaceholderClass = (container: HTMLElement, tobe: number) => {
    expect(container.getElementsByClassName(`${eccgui}-tooltip__wrapper--placeholder`).length).toBe(tobe);
};

describe("Tooltip", () => {
    it("should render placeholder automatically for text tooltip", () => {
        const { container } = render(<Tooltip {...TooltipStory.args} content="this is a simple text tooltip" />);
        checkForPlaceholderClass(container, 1);
    });
    it("should render no placeholder automatically for html tooltip", () => {
        const { container } = render(
            <Tooltip {...TooltipStory.args} content={<div>this is a simple text tooltip</div>} />
        );
        checkForPlaceholderClass(container, 0);
    });
    it("should render placeholder when `usePlaceholder===true`", () => {
        const { container } = render(
            <Tooltip {...TooltipStory.args} content={<div>this is a simple text tooltip</div>} usePlaceholder={true} />
        );
        checkForPlaceholderClass(container, 1);
    });
    it("should render no placeholder when `usePlaceholder===false`", () => {
        const { container } = render(
            <Tooltip {...TooltipStory.args} content="this is a simple text tooltip" usePlaceholder={false} />
        );
        checkForPlaceholderClass(container, 0);
    });
    it("should be displayed on first mouse hover when no placeholder is used", async () => {
        const { container } = render(<Tooltip {...TooltipStory.args} usePlaceholder={false} />);
        fireEvent.mouseEnter(container.getElementsByClassName(`${eccgui}-tooltip__wrapper`)[0]);
        expect(await screen.findByText(TooltipStory.args.content)).toBeVisible();
    });
    it("should not be displayed on first mouse hover when placeholder is used but placeholder markup is swapped", async () => {
        const { container } = render(<Tooltip {...TooltipStory.args} usePlaceholder={true} />);
        fireEvent.mouseEnter(container.getElementsByClassName(`${eccgui}-tooltip__wrapper--placeholder`)[0]);
        checkForPlaceholderClass(container, 1);
        await waitFor(() => {
            expect(screen.queryAllByText(TooltipStory.args.content)).toHaveLength(0);
            checkForPlaceholderClass(container, 0);
        });
    });
    it("should be displayed on two continues mouse hover when placeholder is used", async () => {
        const { container } = render(<Tooltip {...TooltipStory.args} usePlaceholder={true} />);
        fireEvent.mouseEnter(container.getElementsByClassName(`${eccgui}-tooltip__wrapper`)[0]);
        checkForPlaceholderClass(container, 1);
        await waitFor(async () => {
            expect(screen.queryAllByText(TooltipStory.args.content)).toHaveLength(0);
            checkForPlaceholderClass(container, 0);
            fireEvent.mouseOver(container.getElementsByClassName(`${eccgui}-tooltip__wrapper`)[0]);
            expect(await screen.findByText(TooltipStory.args.content)).toBeVisible();
        });
    });
});
