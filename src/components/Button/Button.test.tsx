import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from "../Icon/Icon";

import Button from "./Button";
import { FullExample } from "./Button.stories";

describe("Button", () => {
    it("should render default button successfully", () => {
        render(<Button {...FullExample.args}>Default Button</Button>);
        expect(screen.getByRole("button")).toHaveTextContent(/default button/i);
    });

    it("should have icon at the left followed by text", () => {
        const { container } = render(
            <Button {...FullExample.args} icon={"item-viewdetails"}>
                Left icon
            </Button>,
        );
        expect(screen.getByRole("button").lastChild).toEqual(screen.getByText(/left icon/i));
        expect(container.getElementsByClassName(`${eccgui}-icon`).length).toBe(1);
    });

    it("should have icon at the right after the text", () => {
        const { container } = render(
            <Button {...FullExample.args} rightIcon={<Icon name={"item-download"} />}>
                Right icon
            </Button>,
        );
        expect(screen.getByRole("button").firstChild).toEqual(screen.getByText(/right icon/i));
        expect(container.getElementsByClassName(`${eccgui}-icon`).length).toBe(1);
    });

    it("should render badge markup with correct content when used on an icon button", () => {
        const { container } = render(<Button name="item-info" badge={"badge content"} text={"Cation label"} />);
        const badge = container.querySelector(`.${eccgui}-badge`);
        expect(badge).not.toBeNull();
        expect(badge).toHaveTextContent("badge content");
    });
    it("should render badge markup with correct content when batch displays a 0 (zero) number on an icon button", () => {
        const { container } = render(<Button name="item-info" badge={0} text={"Cation label"} />);
        const badge = container.querySelector(`.${eccgui}-badge`);
        expect(badge).not.toBeNull();
        expect(badge).toHaveTextContent("0");
    });
});
