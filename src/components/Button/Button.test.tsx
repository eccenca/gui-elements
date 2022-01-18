import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import {
  Default,
  ButtonWithLeftIcon,
  ButtonWithRightIcon,
} from "./Button.stories";

import Button from "./Button";

describe("Button", () => {
  it("should render default button successfully", () => {
    render(<Button {...Default.args}>Default Button</Button>);
    expect(screen.getByRole("button")).toHaveTextContent(/default button/i);
  });

  it("should have icon at the left followed by text", () => {
    const { container } = render(
      <Button {...ButtonWithLeftIcon.args}>Button</Button>
    );
    expect(screen.getByRole("button").lastChild).toEqual(
      screen.getByText(/button/i)
    );
    expect(container.getElementsByClassName("eccgui-icon").length).toBe(1);
  });

  it("should have icon at the right after the text", () => {
    const { container } = render(
      <Button {...ButtonWithRightIcon.args}>Button</Button>
    );
    expect(screen.getByRole("button").firstChild).toEqual(
      screen.getByText(/button/i)
    );
    expect(container.getElementsByClassName("eccgui-icon").length).toBe(1);
  });
});
