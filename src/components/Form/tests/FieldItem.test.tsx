import React from "react";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import FieldItem from "./FieldItem";

const renderFieldItem = (props: React.ComponentProps<typeof FieldItem>) => {
    const { container } = render(<FieldItem {...props} />);
    const fieldItem = container.firstElementChild as HTMLElement;
    return {
        fieldItem,
        label: fieldItem.getElementsByClassName(`${eccgui}-fielditem__label`)[0] as HTMLElement,
        input: fieldItem.querySelector(`.${eccgui}-fielditem__inputfields input`) as HTMLElement,
        help: fieldItem.getElementsByClassName(`${eccgui}-fielditem__helpertext`)[0] as HTMLElement,
        message: fieldItem.getElementsByClassName(`${eccgui}-fielditem__message`)[0] as HTMLElement,
    };
};

describe("FieldItem", () => {
    describe("connection of its parts", () => {
        it("should set IDs for all parts that do not have one already", () => {
            const { label, input, help, message } = renderFieldItem({
                labelProps: { text: "Label text" },
                children: <input type="text" />,
                helperText: "Helper text",
                messageText: "Message text",
            });
            expect(label.id).toMatch(/^label_/);
            expect(input.id).toMatch(/^input_/);
            expect(help.id).toMatch(/^help_/);
            expect(message.id).toMatch(/^message_/);
            expect([label.id, input.id, help.id, message.id].map((id) => id.split("_")[1])).toEqual(
                new Array(4).fill(label.id.split("_")[1]),
            );
        });
        it("should create unique IDs for each field item", () => {
            const { container } = render(
                <>
                    <FieldItem labelProps={{ text: "first" }} children={<input type="text" />} />
                    <FieldItem labelProps={{ text: "second" }} children={<input type="text" />} />
                </>,
            );
            const inputs = container.querySelectorAll("input");
            expect(inputs[0].id).not.toBe(inputs[1].id);
        });
        it("should connect label and input element via `for`", () => {
            const { label, input } = renderFieldItem({
                labelProps: { text: "Label text" },
                children: <input type="text" />,
            });
            expect(label.tagName).toBe("LABEL");
            expect(label).toHaveAttribute("for", input.id);
            expect(input).not.toHaveAttribute("aria-labelledby");
        });
        it("should connect label and input element via `aria-labelledby` if the label is no `label` element", () => {
            const { label, input } = renderFieldItem({
                disabled: true,
                labelProps: { text: "Label text" },
                children: <input type="text" />,
            });
            expect(label.tagName).not.toBe("LABEL");
            expect(input).toHaveAttribute("aria-labelledby", label.id);
        });
        it("should connect helper text and message to the input element via `aria-describedby`", () => {
            const { input, help, message } = renderFieldItem({
                children: <input type="text" />,
                helperText: "Helper text",
                messageText: "Message text",
            });
            expect(input).toHaveAttribute("aria-describedby", `${message.id} ${help.id}`);
        });
        it("should only refer to existing parts via `aria-describedby`", () => {
            const { input, help } = renderFieldItem({
                children: <input type="text" />,
                helperText: "Helper text",
            });
            expect(input).toHaveAttribute("aria-describedby", help.id);
        });
        it("should not set `aria-describedby` if there is neither helper text nor message", () => {
            const { input } = renderFieldItem({ children: <input type="text" /> });
            expect(input).not.toHaveAttribute("aria-describedby");
        });
        it("should keep IDs and connections that are set already", () => {
            const { label, help, message } = renderFieldItem({
                labelProps: { text: "Label text", id: "customlabel", htmlFor: "custominput" },
                children: <input type="text" id="custominput" aria-describedby="customhelp" />,
                helperText: "Helper text",
                messageText: "Message text",
            });
            const input = document.getElementById("custominput") as HTMLElement;
            expect(label).toHaveAttribute("id", "customlabel");
            expect(label).toHaveAttribute("for", "custominput");
            expect(input).toHaveAttribute("aria-describedby", `customhelp ${message.id} ${help.id}`);
        });
        it("should not set IDs and connections if `preventAriaAttribution` is set", () => {
            const { label, input, help, message } = renderFieldItem({
                preventAriaAttribution: true,
                labelProps: { text: "Label text" },
                children: <input type="text" />,
                helperText: "Helper text",
                messageText: "Message text",
            });
            [label, input, help, message].forEach((element) => {
                expect(element.id).toBe("");
            });
            expect(label).not.toHaveAttribute("for");
            expect(input).not.toHaveAttribute("aria-labelledby");
            expect(input).not.toHaveAttribute("aria-describedby");
        });
        it("should also connect `textarea`, `select` and select target elements", () => {
            const inputElements = {
                textarea: <textarea />,
                select: (
                    <select>
                        <option>option</option>
                    </select>
                ),
                selecttarget: (
                    <div className={`${eccgui}-select`}>
                        <button type="button">target</button>
                    </div>
                ),
            };
            Object.entries(inputElements).forEach(([elementName, inputElement]) => {
                const { container } = render(<FieldItem labelProps={{ text: "Label text" }} children={inputElement} />);
                const label = container.getElementsByClassName(`${eccgui}-fielditem__label`)[0] as HTMLElement;
                const input = container.querySelector(
                    elementName === "selecttarget" ? "button" : elementName,
                ) as HTMLElement;
                expect(input.id).toMatch(/^input_/);
                expect(label).toHaveAttribute("for", input.id);
            });
        });
        it("should connect the parts of nested field items separately", () => {
            const { container } = render(
                <FieldItem
                    labelProps={{ text: "outer label" }}
                    helperText="outer helper text"
                    children={
                        <FieldItem
                            labelProps={{ text: "inner label" }}
                            helperText="inner helper text"
                            children={<input type="text" />}
                        />
                    }
                />,
            );
            const [outerFieldItem, innerFieldItem] = Array.from(
                container.getElementsByClassName(`${eccgui}-fielditem`),
            ) as HTMLElement[];
            const [outerLabel, innerLabel] = Array.from(
                container.getElementsByClassName(`${eccgui}-fielditem__label`),
            ) as HTMLElement[];
            const [outerHelp, innerHelp] = Array.from(
                container.getElementsByClassName(`${eccgui}-fielditem__helpertext`),
            ) as HTMLElement[];
            const input = container.querySelector("input") as HTMLElement;

            expect(innerFieldItem.contains(input)).toBe(true);
            expect(outerLabel).not.toHaveAttribute("for");
            expect(innerLabel).toHaveAttribute("for", input.id);
            expect(input).toHaveAttribute("aria-describedby", innerHelp.id);
            expect(outerHelp.id).not.toBe(innerHelp.id);
            expect(outerFieldItem.id).toBe("");
        });
    });
});
