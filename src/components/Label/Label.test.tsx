import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import Label from "./Label";
import { Default as LabelStory } from "./Label.stories";

const renderLabel = (props: React.ComponentProps<typeof Label>) => {
    const { container } = render(<Label {...props} />);
    return container.firstElementChild as HTMLElement;
};

describe("Label", () => {
    describe("markup of the content", () => {
        it("should render nothing if no content is set at all", () => {
            const { container } = render(<Label htmlFor="inputid" className="custom-class" />);
            expect(container).toBeEmptyDOMElement();
        });
        it("should render the text", () => {
            renderLabel({ text: "Label text" });
            expect(screen.getByText("Label text")).toHaveClass(`${eccgui}-label__text`);
        });
        it("should render the info", () => {
            renderLabel({ info: "Label info" });
            expect(screen.getByText("Label info")).toHaveClass(`${eccgui}-label__info`);
        });
        it("should render the children", () => {
            renderLabel({ children: "Label children" });
            expect(screen.getByText("Label children")).toHaveClass(`${eccgui}-label__other`);
        });
        it("should render elements used as text and info", () => {
            renderLabel({ text: <em>text element</em>, info: <em>info element</em> });
            expect(screen.getByText("text element").parentElement).toHaveClass(`${eccgui}-label__text`);
            expect(screen.getByText("info element").parentElement).toHaveClass(`${eccgui}-label__info`);
        });
        it("should render an info icon with a tooltip only if a tooltip is set", () => {
            const { container: withoutTooltip } = render(<Label text="Label text" />);
            expect(withoutTooltip.getElementsByClassName(`${eccgui}-label__tooltip`).length).toBe(0);

            const { container: withTooltip } = render(<Label text="Label text" tooltip="Label tooltip" />);
            const tooltip = withTooltip.getElementsByClassName(`${eccgui}-label__tooltip`);
            expect(tooltip.length).toBe(1);
            expect(tooltip[0].getElementsByClassName(`${eccgui}-icon`).length).toBe(1);
        });
        it("should render additional elements separated by a vertical spacing", () => {
            const label = renderLabel({ text: "Label text", additionalElements: <span>additional element</span> });
            expect(screen.getByText("additional element")).toBeInTheDocument();
            expect(label.getElementsByClassName(`${eccgui}-separation__spacing-vertical`).length).toBe(1);
        });
        it("should render all content of the story example", () => {
            const label = renderLabel(LabelStory.args);
            [`__text`, `__info`, `__tooltip`].forEach((contentClass) => {
                expect(label.getElementsByClassName(`${eccgui}-label${contentClass}`).length).toBe(1);
            });
        });
    });

    describe("used HTML element", () => {
        it("should be a `label` element by default", () => {
            expect(renderLabel({ text: "Label text" }).tagName).toBe("LABEL");
        });
        it("should be the element set by `isLayoutForElement`", () => {
            expect(renderLabel({ text: "Label text", isLayoutForElement: "div" }).tagName).toBe("DIV");
        });
        it("should be a `span` element if it is disabled, because a `label` is always active", () => {
            expect(renderLabel({ text: "Label text", disabled: true }).tagName).toBe("SPAN");
        });
        it("should keep the element set by `isLayoutForElement` if it is disabled", () => {
            expect(renderLabel({ text: "Label text", isLayoutForElement: "div", disabled: true }).tagName).toBe("DIV");
        });
        it("should forward other label properties to the element", () => {
            const label = renderLabel({ text: "Label text", htmlFor: "inputid", id: "labelid" });
            expect(label).toHaveAttribute("for", "inputid");
            expect(label).toHaveAttribute("id", "labelid");
        });
    });

    describe("CSS classes of the element", () => {
        it("should use the `normal` emphasis by default", () => {
            expect(renderLabel({ text: "Label text" })).toHaveClass(`${eccgui}-label`, `${eccgui}-label--normal`);
        });
        it("should use the emphasis modifier", () => {
            expect(renderLabel({ text: "Label text", emphasis: "strong" })).toHaveClass(`${eccgui}-label--strong`);
        });
        it("should set the inline modifier only if `inline` is used", () => {
            expect(renderLabel({ text: "Label text" })).not.toHaveClass(`${eccgui}-label--inline`);
            expect(renderLabel({ text: "Label text", inline: true })).toHaveClass(`${eccgui}-label--inline`);
        });
        it("should set the disabled modifier only if `disabled` is used", () => {
            expect(renderLabel({ text: "Label text" })).not.toHaveClass(`${eccgui}-label--disabled`);
            expect(renderLabel({ text: "Label text", disabled: true })).toHaveClass(`${eccgui}-label--disabled`);
        });
        it("should keep the default classes if a custom class is used", () => {
            expect(renderLabel({ text: "Label text", className: "custom-class" })).toHaveClass(
                `${eccgui}-label`,
                `${eccgui}-label--normal`,
                "custom-class",
            );
        });
    });

    /**
     * The label is wrapped by `<ApplicationViewability/>`, it is hidden by CSS rules only,
     * so that it is still available for screen readers.
     */
    describe("hidden label", () => {
        it("should not be hidden by default", () => {
            expect(renderLabel({ text: "Label text" })).not.toHaveClass(`${eccgui}-application__hide--screen`);
        });
        it("should be hidden on screen but kept in the rendering", () => {
            const label = renderLabel({ text: "Label text", hidden: true });
            expect(label.tagName).toBe("LABEL");
            expect(label).toHaveClass(`${eccgui}-label`, `${eccgui}-application__hide--screen`);
            expect(screen.getByText("Label text")).toBeInTheDocument();
        });
    });
});
