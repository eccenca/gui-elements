import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
            <Tooltip {...TooltipStory.args} content={<div>this is a simple text tooltip</div>} />,
        );
        checkForPlaceholderClass(container, 0);
    });
    it("should render placeholder when `usePlaceholder===true`", () => {
        const { container } = render(
            <Tooltip {...TooltipStory.args} content={<div>this is a simple text tooltip</div>} usePlaceholder={true} />,
        );
        checkForPlaceholderClass(container, 1);
    });
    it("should render no placeholder when `usePlaceholder===false`", () => {
        const { container } = render(
            <Tooltip {...TooltipStory.args} content="this is a simple text tooltip" usePlaceholder={false} />,
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
            checkForPlaceholderClass(container, 0);
        });
        expect(screen.queryAllByText(TooltipStory.args.content as string)).toHaveLength(0);
    });
    it("should be displayed on two continues mouse hover when placeholder is used", async () => {
        const { container } = render(<Tooltip {...TooltipStory.args} usePlaceholder={true} />);
        fireEvent.mouseEnter(container.getElementsByClassName(`${eccgui}-tooltip__wrapper`)[0]);
        checkForPlaceholderClass(container, 1);
        await waitFor(() => {
            checkForPlaceholderClass(container, 0);
        });
        expect(screen.queryAllByText(TooltipStory.args.content as string)).toHaveLength(0);
        fireEvent.mouseEnter(container.getElementsByClassName(`${eccgui}-tooltip__wrapper`)[0]);
        expect(await screen.findByText(TooltipStory.args.content as string)).toBeVisible();
    });
    it("should be displayed on focus when no placeholder is used", async () => {
        // Blueprint ignores focus events with null relatedTarget (page-refocus guard), so we tab
        // from a preceding element to produce a non-null relatedTarget.
        render(
            <>
                <button>previous element</button>
                <Tooltip {...TooltipStory.args} usePlaceholder={false} />
            </>,
        );
        const user = userEvent.setup();
        await user.tab(); // focuses "previous element"
        await user.tab(); // focuses tooltip target, relatedTarget is non-null → Blueprint opens
        expect(await screen.findByText(TooltipStory.args.content as string)).toBeVisible();
    });
    it("should be displayed after keyboard focus when placeholder is used", async () => {
        // Use a focusable button child so refocus() can call .focus() on it after the swap.
        // Tab from a preceding element so relatedTarget is non-null when Blueprint handles focus.
        const { container } = render(
            <>
                <button>previous element</button>
                <Tooltip {...TooltipStory.args} usePlaceholder={true}>
                    <button>tooltip target</button>
                </Tooltip>
            </>,
        );
        const user = userEvent.setup();
        await user.tab(); // focuses "previous element"
        await user.tab(); // focuses placeholder inner button, triggers focusin swap
        checkForPlaceholderClass(container, 1);
        await waitFor(() => {
            checkForPlaceholderClass(container, 0);
        });
        expect(await screen.findByText(TooltipStory.args.content as string)).toBeVisible();
    });
    it("should not apply the accent intent class when intent is undefined", () => {
        render(
            <Tooltip {...TooltipStory.args} isOpen intent={undefined}>
                <span>target</span>
            </Tooltip>,
        );
        expect(document.querySelectorAll(`.${eccgui}-intent--accent`)).toHaveLength(0);
    });
    it("should apply the accent intent class for the custom accent intent", () => {
        render(
            <Tooltip {...TooltipStory.args} isOpen intent="accent">
                <span>target</span>
            </Tooltip>,
        );
        expect(document.querySelectorAll(`.${eccgui}-intent--accent`)).toHaveLength(1);
    });
});
