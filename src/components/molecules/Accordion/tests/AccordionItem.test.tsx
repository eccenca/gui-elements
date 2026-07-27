import React from "react";
import { fireEvent, render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { AccordionItem } from "../AccordionItem";

const trigger = (c: HTMLElement) => c.querySelector("button.eccgui-accordion__heading") as HTMLButtonElement;
const isOpen = (c: HTMLElement) => trigger(c).getAttribute("aria-expanded") === "true";

describe("AccordionItem", () => {
    it("seeds its open state from the `open` prop", () => {
        const { container: closed } = render(<AccordionItem label="L">body</AccordionItem>);
        expect(isOpen(closed)).toBe(false);
        const { container: opened } = render(
            <AccordionItem label="L" open>
                body
            </AccordionItem>,
        );
        expect(isOpen(opened)).toBe(true);
    });

    it("keeps the collapsed content mounted in the DOM (Carbon parity)", () => {
        const { container } = render(
            <AccordionItem label="L" open={false}>
                <span>hidden-but-mounted</span>
            </AccordionItem>,
        );
        // content is force-mounted even while collapsed, only its data-state marks it closed
        expect(container).toHaveTextContent("hidden-but-mounted");
        const content = container.querySelector(".eccgui-accordion__content") as HTMLElement;
        expect(content).toHaveAttribute("data-state", "closed");
    });

    it("re-syncs when the `open` prop changes", () => {
        const { container, rerender } = render(
            <AccordionItem label="L" open={false}>
                body
            </AccordionItem>,
        );
        expect(isOpen(container)).toBe(false);

        rerender(
            <AccordionItem label="L" open={true}>
                body
            </AccordionItem>,
        );
        expect(isOpen(container)).toBe(true);

        rerender(
            <AccordionItem label="L" open={false}>
                body
            </AccordionItem>,
        );
        expect(isOpen(container)).toBe(false);
    });

    it("lets a user toggle win until the next `open` prop change", () => {
        const { container, rerender } = render(
            <AccordionItem label="L" open={true}>
                body
            </AccordionItem>,
        );
        expect(isOpen(container)).toBe(true);

        // user collapses it locally
        fireEvent.click(trigger(container));
        expect(isOpen(container)).toBe(false);

        // a re-render with the SAME prop value must not clobber the user's toggle
        rerender(
            <AccordionItem label="L" open={true}>
                body
            </AccordionItem>,
        );
        expect(isOpen(container)).toBe(false);

        // a genuine prop change re-syncs and overrides the user's local state
        rerender(
            <AccordionItem label="L" open={false}>
                body
            </AccordionItem>,
        );
        rerender(
            <AccordionItem label="L" open={true}>
                body
            </AccordionItem>,
        );
        expect(isOpen(container)).toBe(true);
    });

    it("fires onHeadingClick with the resulting open state and the real click event", () => {
        const onHeadingClick = jest.fn();
        const { container } = render(
            <AccordionItem label="L" open={false} onHeadingClick={onHeadingClick}>
                body
            </AccordionItem>,
        );
        fireEvent.click(trigger(container));
        expect(onHeadingClick).toHaveBeenCalledTimes(1);
        const arg = onHeadingClick.mock.calls[0][0];
        // opening: resulting state is `true`
        expect(arg.isOpen).toBe(true);
        expect(arg.event.type).toBe("click");
        expect(arg.event.nativeEvent).toBeInstanceOf(MouseEvent);

        // clicking again reports the resulting collapsed state
        fireEvent.click(trigger(container));
        expect(onHeadingClick.mock.calls[1][0].isOpen).toBe(false);
    });

    it("does not toggle or fire when disabled", () => {
        const onHeadingClick = jest.fn();
        const { container } = render(
            <AccordionItem label="L" open={false} disabled onHeadingClick={onHeadingClick}>
                body
            </AccordionItem>,
        );
        fireEvent.click(trigger(container));
        expect(isOpen(container)).toBe(false);
        expect(onHeadingClick).not.toHaveBeenCalled();
    });
});
