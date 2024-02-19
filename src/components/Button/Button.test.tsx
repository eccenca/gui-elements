import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

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
            </Button>
        );
        expect(screen.getByRole("button").lastChild).toEqual(screen.getByText(/left icon/i));
        expect(container.getElementsByClassName("eccgui-icon").length).toBe(1);
    });

    it("should have icon at the right after the text", () => {
        const { container } = render(
            <Button {...FullExample.args} rightIcon={<Icon name={"item-download"} />}>
                Right icon
            </Button>
        );
        expect(screen.getByRole("button").firstChild).toEqual(screen.getByText(/right icon/i));
        expect(container.getElementsByClassName("eccgui-icon").length).toBe(1);
    });
});
