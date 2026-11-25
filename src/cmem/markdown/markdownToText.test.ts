import { markdownToText } from "../../../index";

describe("markdownToText", () => {
    it("keeps link labels and code, and decodes entities", () => {
        expect(
            markdownToText(
                "Use **regular expressions** and [replacement rules](https://example.com/hidden). `x < y` &amp; `a*b`.",
            ),
        ).toBe("Use regular expressions and replacement rules. x < y & a*b.");
    });

    it("preserves word boundaries across paragraphs, lists, line breaks, and table cells", () => {
        const markdown = [
            "# Overview",
            "",
            "- First item",
            "- Second item",
            "",
            "Hard break\\",
            "next line",
            "",
            "| Name | Value |",
            "| --- | --- |",
            "| alpha | one |",
        ].join("\n");

        expect(markdownToText(markdown)).toBe(
            "Overview First item Second item Hard break next line Name Value alpha one",
        );
    });

    it("returns an empty string for blank Markdown", () => {
        expect(markdownToText(" \n\t ")).toBe("");
    });
});
