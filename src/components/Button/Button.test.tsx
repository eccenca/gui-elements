import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import Button from "./Button";

describe("Button", () => {
  it("should render default button successfully", () => {
    render(<Button>Default Button</Button>);
  });
});
