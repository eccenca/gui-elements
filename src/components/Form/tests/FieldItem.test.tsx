import React from "react";
import { render, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { CodeEditor } from "../../../extensions/codemirror/CodeMirror";
import FieldItem from "../FieldItem";

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
        it("should keep a `for` that refers to the ID of the input element", () => {
            const { label } = renderFieldItem({
                labelProps: { text: "Label text", htmlFor: "custominput" },
                children: <input type="text" id="custominput" />,
            });
            expect(label).toHaveAttribute("for", "custominput");
        });
        it("should replace a `for` that does not refer to the ID of the input element", () => {
            const { label, input } = renderFieldItem({
                labelProps: { text: "Label text", htmlFor: "otherelement" },
                children: <input type="text" />,
            });
            expect(input.id).toMatch(/^input_/);
            expect(label).toHaveAttribute("for", input.id);
        });
        it("should replace a `for` that refers to another element than the input element", () => {
            const { label, input } = renderFieldItem({
                labelProps: { text: "Label text", htmlFor: "otherinput" },
                children: (
                    <>
                        <input type="text" id="custominput" />
                        <input type="text" id="otherinput" />
                    </>
                ),
            });
            expect(input).toHaveAttribute("id", "custominput");
            expect(label).toHaveAttribute("for", "custominput");
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
        it("should remove the reference to a removed label from `aria-labelledby`", () => {
            const { container, rerender } = render(
                <FieldItem disabled labelProps={{ text: "Label text" }} children={<input type="text" />} />,
            );
            const label = container.getElementsByClassName(`${eccgui}-fielditem__label`)[0] as HTMLElement;
            const input = container.querySelector("input") as HTMLElement;
            expect(input).toHaveAttribute("aria-labelledby", label.id);

            rerender(<FieldItem disabled children={<input type="text" />} />);
            expect(container.getElementsByClassName(`${eccgui}-fielditem__label`).length).toBe(0);
            expect(input).not.toHaveAttribute("aria-labelledby");
        });
        it("should remove the reference to a removed helper text from `aria-describedby`", () => {
            const { container, rerender } = render(
                <FieldItem helperText="Helper text" messageText="Message text" children={<input type="text" />} />,
            );
            const message = container.getElementsByClassName(`${eccgui}-fielditem__message`)[0] as HTMLElement;
            const help = container.getElementsByClassName(`${eccgui}-fielditem__helpertext`)[0] as HTMLElement;
            const input = container.querySelector("input") as HTMLElement;
            expect(input).toHaveAttribute("aria-describedby", `${message.id} ${help.id}`);

            rerender(<FieldItem messageText="Message text" children={<input type="text" />} />);
            expect(container.getElementsByClassName(`${eccgui}-fielditem__helpertext`).length).toBe(0);
            expect(input).toHaveAttribute("aria-describedby", message.id);
        });
        it("should remove the reference to a removed message from `aria-describedby`", () => {
            const { container, rerender } = render(
                <FieldItem helperText="Helper text" messageText="Message text" children={<input type="text" />} />,
            );
            const help = container.getElementsByClassName(`${eccgui}-fielditem__helpertext`)[0] as HTMLElement;
            const input = container.querySelector("input") as HTMLElement;

            rerender(<FieldItem helperText="Helper text" children={<input type="text" />} />);
            expect(container.getElementsByClassName(`${eccgui}-fielditem__message`).length).toBe(0);
            expect(input).toHaveAttribute("aria-describedby", help.id);
        });
        it("should remove `aria-describedby` if helper text and message are removed", () => {
            const { container, rerender } = render(
                <FieldItem helperText="Helper text" messageText="Message text" children={<input type="text" />} />,
            );
            const input = container.querySelector("input") as HTMLElement;
            expect(input).toHaveAttribute("aria-describedby");

            rerender(<FieldItem children={<input type="text" />} />);
            expect(input).not.toHaveAttribute("aria-describedby");
        });
        it("should keep references of the using application if parts are removed", () => {
            const customInput = (
                <input type="text" id="custominput" aria-labelledby="customlabel" aria-describedby="customhelp" />
            );
            const { container, rerender } = render(
                <FieldItem disabled labelProps={{ text: "Label text" }} helperText="Helper text">
                    {customInput}
                </FieldItem>,
            );
            const input = container.querySelector("input") as HTMLElement;
            const help = container.getElementsByClassName(`${eccgui}-fielditem__helpertext`)[0] as HTMLElement;
            expect(input).toHaveAttribute("aria-labelledby", "customlabel");
            expect(input).toHaveAttribute("aria-describedby", `customhelp ${help.id}`);

            rerender(<FieldItem disabled>{customInput}</FieldItem>);
            expect(input).toHaveAttribute("aria-labelledby", "customlabel");
            expect(input).toHaveAttribute("aria-describedby", "customhelp");
        });
        it("should connect a code editor input element via `aria-labelledby`", () => {
            const { container } = render(
                <FieldItem labelProps={{ text: "Label text" }} helperText="Helper text">
                    <div className={`${eccgui}-codeeditor`}>
                        <div className="cm-editor">
                            <div className="cm-content" contentEditable role="textbox" />
                        </div>
                    </div>
                </FieldItem>,
            );
            const label = container.getElementsByClassName(`${eccgui}-fielditem__label`)[0] as HTMLElement;
            const help = container.getElementsByClassName(`${eccgui}-fielditem__helpertext`)[0] as HTMLElement;
            const input = container.querySelector(".cm-content") as HTMLElement;

            expect(input.id).toMatch(/^input_/);
            // the editable area of the code editor is no labelable element, so `for` cannot be used
            expect(label).not.toHaveAttribute("for");
            expect(input).toHaveAttribute("aria-labelledby", label.id);
            expect(input).toHaveAttribute("aria-describedby", help.id);
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

describe("FieldItem with CodeEditor", () => {
    beforeAll(() => {
        // the code editor needs range support that is not provided by jsdom
        document.createRange = () => {
            const range = new Range();
            range.getBoundingClientRect = jest.fn();
            range.getClientRects = () => ({
                item: () => null,
                length: 0,
                [Symbol.iterator]: jest.fn(),
            });
            return range;
        };
    });

    it("should connect the editable area of the code editor", async () => {
        const { container } = render(
            <FieldItem labelProps={{ text: "Label text" }} messageText="Message text">
                <CodeEditor name="test-editor" mode="yaml" />
            </FieldItem>,
        );
        const label = container.getElementsByClassName(`${eccgui}-fielditem__label`)[0] as HTMLElement;
        const message = container.getElementsByClassName(`${eccgui}-fielditem__message`)[0] as HTMLElement;
        const input = container.querySelector(`.${eccgui}-codeeditor .cm-content`) as HTMLElement;
        expect(input).not.toBeNull();

        // the editable area is created by the code editor itself, so it is connected asynchronously
        await waitFor(() => {
            expect(input.id).toMatch(/^input_/);
        });
        expect(label).not.toHaveAttribute("for");
        expect(input).toHaveAttribute("aria-labelledby", label.id);
        expect(input).toHaveAttribute("aria-describedby", message.id);
    });
});
