import React from "react";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { Badge } from "../../../index";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

describe("Badge", () => {
    it("should shorten a number badge exceeding maxLength to a 9+ notation", () => {
        const { container } = render(<Badge maxLength={2}>{42}</Badge>);
        const badge = container.querySelector(`.${eccgui}-badge__tag`);
        expect(badge).not.toBeNull();
        expect(badge).toHaveTextContent("9+");
    });
    it("should apply maxWidth style to a string badge when maxLength is set", () => {
        const { container } = render(<Badge maxLength={4}>forty two</Badge>);
        const tag = container.querySelector(`.${eccgui}-badge__tag`);
        expect(tag).not.toBeNull();
        expect((tag as HTMLElement).style.maxWidth).toBe("calc((3em + 3ch)/2)");
    });
});
