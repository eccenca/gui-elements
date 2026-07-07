import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import Tooltip from "./Tooltip";

const stringContent = "this is a simple text tooltip";

const getWrapper = (container: HTMLElement) =>
    container.getElementsByClassName(`${eccgui}-tooltip__wrapper`)[0] as HTMLElement;

/**
 * Radix renders the tooltip overlay into a portal (on `document.body` in these tests) and adds
 * an accessible, visually-hidden duplicate of the content next to the visible content. Queries are
 * therefore scoped to the single visible overlay element (`.${eccgui}-tooltip__content`).
 */
const findOverlay = async (): Promise<HTMLElement> =>
    waitFor(
        () => {
            const overlay = document.querySelector(`.${eccgui}-tooltip__content`);
            if (!overlay) {
                throw new Error("tooltip overlay not (yet) rendered");
            }
            return overlay as HTMLElement;
        },
        { timeout: 3000 },
    );

const queryOverlay = () => document.querySelector(`.${eccgui}-tooltip__content`);

describe("Tooltip", () => {
    it("renders the target wrapper carrying the eccgui classname", () => {
        const { container } = render(
            <Tooltip content={stringContent} addIndicator>
                hover me
            </Tooltip>,
        );
        const wrappers = container.getElementsByClassName(`${eccgui}-tooltip__wrapper`);
        expect(wrappers).toHaveLength(1);
        expect(wrappers[0]).toHaveTextContent("hover me");
    });

    it("renders no tooltip overlay before any interaction (Radix renders it lazily)", () => {
        render(<Tooltip content={stringContent}>hover me</Tooltip>);
        expect(queryOverlay()).not.toBeInTheDocument();
    });

    it("is displayed on mouse hover", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Tooltip content={stringContent} hoverOpenDelay={0}>
                hover me
            </Tooltip>,
        );
        await user.hover(getWrapper(container));
        const overlay = await findOverlay();
        expect(overlay).toBeVisible();
        expect(overlay).toHaveTextContent(stringContent);
    });

    it("is displayed with html/JSX content on mouse hover", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Tooltip content={<div data-testid="jsx-tooltip">rich content</div>} hoverOpenDelay={0}>
                hover me
            </Tooltip>,
        );
        await user.hover(getWrapper(container));
        const overlay = await findOverlay();
        expect(overlay).toBeVisible();
        expect(overlay.querySelector('[data-testid="jsx-tooltip"]')).toBeInTheDocument();
        expect(overlay).toHaveTextContent("rich content");
    });

    it("renders string content as Markdown when it matches the enabler", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Tooltip content={"## Headline\n\nbody text"} hoverOpenDelay={0}>
                hover me
            </Tooltip>,
        );
        await user.hover(getWrapper(container));
        const overlay = await findOverlay();
        const heading = overlay.querySelector("h2");
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent("Headline");
    });

    it("renders the raw string when Markdown is disabled via markdownEnabler={false}", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Tooltip content={"## Headline\n\nbody text"} markdownEnabler={false} hoverOpenDelay={0}>
                hover me
            </Tooltip>,
        );
        await user.hover(getWrapper(container));
        const overlay = await findOverlay();
        expect(overlay).toHaveTextContent("body text");
        // no Markdown parsing happened → no rendered heading element
        expect(overlay.querySelector("h2")).not.toBeInTheDocument();
    });

    it("applies the size class to the tooltip overlay", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Tooltip content={stringContent} size="large" hoverOpenDelay={0}>
                hover me
            </Tooltip>,
        );
        await user.hover(getWrapper(container));
        const overlay = await findOverlay();
        expect(overlay).toHaveClass(`${eccgui}-tooltip--large`);
        expect(overlay).toHaveClass(`${eccgui}-tooltip__content`);
    });

    it("applies the custom className to the target wrapper and the overlay", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Tooltip content={stringContent} className="my-tooltip" hoverOpenDelay={0}>
                hover me
            </Tooltip>,
        );
        expect(getWrapper(container)).toHaveClass("my-tooltip");
        await user.hover(getWrapper(container));
        const overlay = await findOverlay();
        expect(overlay).toHaveClass("my-tooltip__content");
    });

    it("does not render a tooltip when disabled (only the target)", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Tooltip content={stringContent} disabled hoverOpenDelay={0}>
                hover me
            </Tooltip>,
        );
        expect(getWrapper(container)).toHaveTextContent("hover me");
        await user.hover(getWrapper(container));
        // give any (unexpected) open timer a chance to fire before asserting absence
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(queryOverlay()).not.toBeInTheDocument();
    });

    it("does not render a tooltip when content is empty", async () => {
        const user = userEvent.setup();
        const { container } = render(<Tooltip content="">hover me</Tooltip>);
        const wrapper = getWrapper(container);
        expect(wrapper).toHaveTextContent("hover me");
        await user.hover(wrapper);
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(queryOverlay()).not.toBeInTheDocument();
    });

    it("is displayed on keyboard focus of a focusable target", async () => {
        const user = userEvent.setup();
        render(
            <Tooltip content={stringContent} hoverOpenDelay={0}>
                <button>tooltip target</button>
            </Tooltip>,
        );
        await user.tab(); // focuses the button inside the trigger wrapper
        const overlay = await findOverlay();
        expect(overlay).toBeVisible();
        expect(overlay).toHaveTextContent(stringContent);
    });
});
