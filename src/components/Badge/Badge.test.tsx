import React from "react";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { IconButton } from "../../../index";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

describe("Badge", () => {
    it("should render badge markup with correct content when used on an icon button", () => {
        const { container } = render(<IconButton name="item-info" badge={"badge content"} />);
        const badge = container.querySelector(`.${eccgui}-badge`);
        expect(badge).not.toBeNull();
        expect(badge).toHaveTextContent("badge content");
    });
    it("should render badge markup with correct content when batch displays a 0 (zero) number on an icon button", () => {
        const { container } = render(<IconButton name="item-info" badge={0} />);
        const badge = container.querySelector(`.${eccgui}-badge`);
        expect(badge).not.toBeNull();
        expect(badge).toHaveTextContent("0");
    });
});
