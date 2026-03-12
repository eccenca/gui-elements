import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { Default } from "../stories/Tag.stories";
import Tag from "../Tag";

const eccgui = "eccgui";

describe("Tag", () => {
    it("renders tag content", () => {
        render(<Tag {...Default.args}>Tag label</Tag>);
        expect(screen.getByText("Tag label")).toBeInTheDocument();
    });

    it("always has base class and default emphasis class", () => {
        const { container } = render(<Tag>label</Tag>);
        const tag = container.firstChild as HTMLElement;
        expect(tag).toHaveClass(`${eccgui}-tag__item`);
        expect(tag).toHaveClass(`${eccgui}-tag--normalemphasis`);
    });

    it("applies small class when small prop is set", () => {
        const { container } = render(<Tag small>label</Tag>);
        expect(container.firstChild).toHaveClass(`${eccgui}-tag--small`);
    });

    it("applies large class when large prop is set", () => {
        const { container } = render(<Tag large>label</Tag>);
        expect(container.firstChild).toHaveClass(`${eccgui}-tag--large`);
    });

    it("applies correct emphasis class", () => {
        const { container } = render(<Tag emphasis="stronger">label</Tag>);
        expect(container.firstChild).toHaveClass(`${eccgui}-tag--strongeremphasis`);
    });

    it("applies intent class when intent prop is set", () => {
        const { container } = render(<Tag intent="primary">label</Tag>);
        expect(container.firstChild).toHaveClass(`${eccgui}-intent--primary`);
    });

    it("applies outlined class when outlined prop is set", () => {
        const { container } = render(<Tag outlined>label</Tag>);
        expect(container.firstChild).toHaveClass(`${eccgui}-tag--outlined`);
    });

    it("does not apply outlined class by default", () => {
        const { container } = render(<Tag>label</Tag>);
        expect(container.firstChild).not.toHaveClass(`${eccgui}-tag--outlined`);
    });

    describe("backgroundColor", () => {
        it("sets background-color and text color inline styles", () => {
            const { container } = render(<Tag backgroundColor="#ff0000">label</Tag>);
            const tag = container.firstChild as HTMLElement;
            expect(tag.style.backgroundColor).toBeTruthy();
            expect(tag.style.color).toBeTruthy();
        });

        it("does not set inline background-color when outlined", () => {
            const { container } = render(<Tag outlined backgroundColor="#ff0000">label</Tag>);
            const tag = container.firstChild as HTMLElement;
            expect(tag.style.backgroundColor).toBeFalsy();
        });

        it("sets border-color from backgroundColor when outlined", () => {
            const { container } = render(<Tag outlined backgroundColor="#ff0000">label</Tag>);
            const tag = container.firstChild as HTMLElement;
            expect(tag.style.borderColor).toBeTruthy();
        });

        it("sets black border-color by default when outlined without backgroundColor", () => {
            const { container } = render(<Tag outlined>label</Tag>);
            const tag = container.firstChild as HTMLElement;
            expect(tag.style.borderColor).toBe("rgb(0, 0, 0)");
        });

        it("does not set any inline color style when no backgroundColor is provided", () => {
            const { container } = render(<Tag>label</Tag>);
            const tag = container.firstChild as HTMLElement;
            expect(tag.style.backgroundColor).toBeFalsy();
            expect(tag.style.color).toBeFalsy();
            expect(tag.style.borderColor).toBeFalsy();
        });
    });

    describe("icon", () => {
        it("renders icon when icon prop is a string", () => {
            const { container } = render(<Tag icon="item-info">label</Tag>);
            expect(container.getElementsByClassName(`${eccgui}-icon`).length).toBeGreaterThan(0);
        });
    });

    describe("interactive", () => {
        it("is not interactive by default", () => {
            const { container } = render(<Tag>label</Tag>);
            expect(container.firstChild).not.toHaveClass("bp5-interactive");
        });

        it("is interactive when onClick is provided", () => {
            const { container } = render(<Tag onClick={jest.fn()}>label</Tag>);
            expect(container.firstChild).toHaveClass("bp5-interactive");
        });
    });
});
