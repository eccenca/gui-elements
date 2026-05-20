import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { ColorField } from "./ColorField";

describe("ColorField", () => {
    describe("rendering", () => {
        it("renders without crashing, and correct component CSS class is applied", () => {
            const { container } = render(<ColorField />);
            expect(container).not.toBeEmptyDOMElement();
            expect(container.getElementsByClassName(`${eccgui}-colorfield`).length).toBe(1);
        });

        it("renders a color input by default (no palette presets)", () => {
            const { container } = render(<ColorField colorPresets={[]} allowCustomColor={true} />);
            expect(container.querySelector("input[type='color']")).toBeInTheDocument();
        });

        it("renders a readonly text input when palette colors are configured, and custom picker CSS class is applied", () => {
            const { container } = render(
                <ColorField
                    className="my-custom-class"
                    colorPresets={[
                        ["my-black", "#000000"],
                        ["my-white", "#ffffff"],
                    ]}
                />,
            );
            // With default palette settings, a text input with readOnly is shown
            expect(container.querySelector("input[type='text']")).toBeInTheDocument();
            expect(container.querySelector("input[readonly]")).toBeInTheDocument();
            expect(container.querySelector(`.${eccgui}-colorfield--custom-picker`)).toBeInTheDocument();
        });

        it("applies additional className", () => {
            render(<ColorField className="my-custom-class" colorPresets={[]} allowCustomColor={true} />);
            expect(document.querySelector(".my-custom-class")).toBeInTheDocument();
        });
    });

    describe("value handling", () => {
        it("uses defaultValue as initial color", () => {
            render(<ColorField defaultValue="#ff0000" colorPresets={[]} allowCustomColor={true} />);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.value).toBe("#ff0000");
        });

        it("uses value prop as initial color", () => {
            render(<ColorField value="#00ff00" colorPresets={[]} allowCustomColor={true} />);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.value).toBe("#00ff00");
        });

        it("falls back to #000000 when no value or defaultValue is provided", () => {
            render(<ColorField colorPresets={[]} allowCustomColor={true} />);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.value).toBe("#000000");
        });

        it("updates displayed value when value prop changes", () => {
            const { rerender } = render(<ColorField value="#ff0000" colorPresets={[]} allowCustomColor={true} />);
            let input = document.querySelector("input") as HTMLInputElement;
            expect(input.value).toBe("#ff0000");

            rerender(<ColorField value="#0000ff" colorPresets={[]} allowCustomColor={true} />);
            input = document.querySelector("input") as HTMLInputElement;
            expect(input.value).toBe("#0000ff");
        });
    });

    describe("disabled state", () => {
        it("is disabled when disabled prop is true", () => {
            render(<ColorField disabled colorPresets={[]} allowCustomColor={true} />);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input).toBeDisabled();
        });

        it("is disabled when no palette colors and allowCustomColor is false", () => {
            render(<ColorField colorPresets={[]} allowCustomColor={false} />);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input).toBeDisabled();
        });
    });

    describe("onChange callback", () => {
        it("calls onChange when native color input changes", async () => {
            const user = userEvent.setup();
            const onChange = jest.fn();
            render(<ColorField onChange={onChange} colorPresets={[]} allowCustomColor={true} />);
            const input = document.querySelector("input[type='color']") as HTMLInputElement;
            input.type = "text"; // for unknown reasons Jest seems not able to test it on color inputs
            await user.type(input, "#123456");
            expect(onChange).toHaveBeenCalled();
        });
    });
});
