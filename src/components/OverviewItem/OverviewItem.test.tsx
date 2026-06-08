import React from "react";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { IntentTypes } from "../../common/Intent";

import OverviewItem from "./OverviewItem";

describe("OverviewItem", () => {
    const findItem = (container: HTMLElement) => container.querySelector(".eccgui-overviewitem__item");

    it("does not apply any intent class when `intent` is not set", () => {
        const { container } = render(<OverviewItem>content</OverviewItem>);
        const item = findItem(container);
        expect(item).not.toBeNull();
        expect(item!.className).not.toMatch(/eccgui-intent--/);
    });

    it.each<IntentTypes>(["primary", "success", "warning", "danger", "neutral", "accent", "info"])(
        'applies the matching intent class for `intent="%s"`',
        (intent) => {
            const { container } = render(<OverviewItem intent={intent}>content</OverviewItem>);
            const item = findItem(container);
            expect(item).not.toBeNull();
            expect(item).toHaveClass(`eccgui-intent--${intent}`);
        },
    );

    it("keeps the base class and additional className alongside the intent class", () => {
        const { container } = render(
            <OverviewItem intent="success" className="custom-class">
                content
            </OverviewItem>,
        );
        const item = findItem(container);
        expect(item).toHaveClass("eccgui-overviewitem__item");
        expect(item).toHaveClass("eccgui-intent--success");
        expect(item).toHaveClass("custom-class");
    });
});
