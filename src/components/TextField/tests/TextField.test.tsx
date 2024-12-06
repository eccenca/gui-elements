import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";

import { TextField } from "../TextField";

describe("TestField", () => {
    it("should render default input", () => {
        render(<TextField data-testid="text_field" placeholder="placeholder text" />);
        const input = screen.getByTestId("text_field") as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input.placeholder).toBe("placeholder text");
        expect(input.value).toBe("");
        expect(input.type).toBe("text");
    });

    it("should allow all symbols", () => {
        render(<TextField data-testid="text_field" />);
        const input = screen.getByTestId("text_field") as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input.value).toBe("");

        fireEvent.change(input, { target: { value: "test" } });
        expect(input.value).toBe("test");
    });

    it("should allow only numbers", async () => {
        render(<TextField data-testid="numeric_field" type="number" />);
        const input = screen.getByTestId("numeric_field") as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input.value).toBe("");

        await userEvent.type(input, "test");
        expect(input.value).toBe("");

        await userEvent.type(input, "1");
        expect(input.value).toBe("1");

        await userEvent.type(input, "-");
        expect(input.value).toBe("1");

        await userEvent.type(input, ".2");
        expect(input.value).toBe("1.2");

        await userEvent.type(input, ".3");
        expect(input.value).toBe("1.23");

        await userEvent.clear(input);
        await userEvent.type(input, "-1.5");
        expect(input.value).toBe("-1.5");
    });
});
