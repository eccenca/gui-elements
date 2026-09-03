import React from "react";
import { render } from "@testing-library/react";

import { truncateMarkdownDisplay } from "../../common/utils/truncateMarkdownDisplay";

import { Markdown } from "./Markdown";

describe("Markdown", () => {
    it("keeps markdown links valid when cutOff is calculated from rendered link labels", () => {
        const linkHeavy = Array.from({ length: 20 }, (_, i) => `[click](https://example.com/${i})`).join(" ");
        const { container } = render(<Markdown cutOff={60}>{linkHeavy}</Markdown>);

        expect(container.querySelectorAll("a").length).toBeGreaterThan(0);
        expect(container.textContent).toContain("click");
        expect(container.textContent).not.toContain("https://example.com");
    });

    it("backs up before a fenced code block when cutOff falls inside it after a paragraph boundary", () => {
        const content = [
            "Intro.",
            "",
            "```",
            "const first = 1;",
            "const second = 2;",
            "const third = 3;",
            "```",
            "",
            "Outro.",
        ].join("\n");

        const { container } = render(<Markdown cutOff={35}>{content}</Markdown>);

        expect(container.querySelector("pre")).toBeFalsy();
        expect(container.textContent).toContain("Intro.");
        expect(container.textContent).not.toContain("const first");
        expect(container.textContent).not.toContain("Outro");
    });

    it("backs up before a fenced code block when cutOff falls inside it after preceding text without a paragraph boundary", () => {
        const content = [
            "A short paragraph before the code block.",
            "Here is an important code example:",
            "```json",
            "{",
            '    "host": "localhost"',
            "}",
            "```",
            "",
            "After fence.",
        ].join("\n");

        const { container } = render(<Markdown cutOff={content.indexOf("localhost")}>{content}</Markdown>);

        expect(container.querySelector("pre")).toBeFalsy();
        expect(container.textContent).toContain("Here is an important code example:");
        expect(container.textContent).not.toContain("localhost");
        expect(container.textContent).not.toContain("After fence");
    });

    it("renders a valid table when cutOff falls inside a markdown table", () => {
        const content = [
            "| Name | Value |",
            "| --- | --- |",
            "| alpha | one |",
            "| beta | two |",
            "| gamma | three |",
            "",
            "After table.",
        ].join("\n");

        const { container } = render(<Markdown cutOff={55}>{content}</Markdown>);

        expect(container.querySelector("table")).toBeTruthy();
        expect(container.textContent).toContain("Name");
        expect(container.textContent).toContain("alpha");
        expect(container.textContent).not.toContain("After table");
    });

    it("keeps a complete list when cutOff falls after it without a paragraph boundary", () => {
        const content = `This component renders Markdown content safely. It supports **GitHub Flavoured Markdown**, syntax highlighting for code blocks, and definition lists.

You can:
 * configure _link targets_
 * add custom __rehype__ plugins
 * and filter content through an allowed elements list
A third paragraph that will not appear once the cutOff limit is reached.`;

        const { container } = render(<Markdown cutOff={300}>{content}</Markdown>);

        expect(container.textContent).toContain("You can:");
        expect(container.textContent).toContain("configure link targets");
        expect(container.textContent).toContain("add custom rehype plugins");
        expect(container.textContent).toContain("and filter content through an allowed elements list");
        expect(container.textContent).not.toContain("A third paragraph");
    });

    it("keeps complete fenced blocks before a following link with display cutOff", () => {
        const content = [
            "A short paragraph before the code block.",
            "",
            "```ts",
            'const status = "ready";',
            'const nextStep = "open details";',
            "```",
            "",
            "~~~ts",
            "some code here",
            "~~~",
            "Continue with the [detailed implementation guide](https://example.com/docs/implementation/very/long/path) after the code block.",
        ].join("\n");

        for (const cutOff of [152, 153]) {
            const { container } = render(truncateMarkdownDisplay(<Markdown cutOff={cutOff}>{content}</Markdown>));

            expect(container.querySelectorAll("pre")).toHaveLength(2);
            expect(container.textContent).toContain('const status = "ready";');
            expect(container.textContent).toContain("some code here");
            expect(container.textContent).toContain("Continue with the");
            expect(container.textContent).not.toContain("https://example.com");
        }
    });

    it("renders a link at the end of long content when cutOff is absent", () => {
        const content = `${Array.from({ length: 40 }, (_, index) => `Long visible paragraph part ${index + 1}.`).join(
            " ",
        )} [final reference](https://example.com/final-reference)`;

        const { container } = render(<Markdown>{content}</Markdown>);

        expect(container.textContent).toContain("Long visible paragraph part 1.");
        expect(container.textContent).toContain("final reference");
        expect(container.querySelector('a[href="https://example.com/final-reference"]')).toBeTruthy();
    });
});
