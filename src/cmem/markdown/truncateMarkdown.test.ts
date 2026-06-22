import { truncateMarkdown } from "./truncateMarkdown";

describe("truncateMarkdown", () => {
    it("returns content unchanged when length is less than cutOff", () => {
        const content = "Short content.";
        expect(truncateMarkdown(content, 1000)).toBe(content);
    });

    it("cuts at the last paragraph boundary before the cutOff", () => {
        const content = "First paragraph.\n\nSecond paragraph that is longer.";
        // cutOff at 30 — inside "Second paragraph", should cut after first \n\n
        const result = truncateMarkdown(content, 30, "...");
        expect(result).toBe("First paragraph.\n\n...");
    });

    it("cuts at the nearest paragraph boundary when multiple exist", () => {
        const content = "Para one.\n\nPara two.\n\nPara three that pushes past the limit.";
        const result = truncateMarkdown(content, 35, "...");
        expect(result).toBe("Para one.\n\nPara two.\n\n...");
    });

    it("appends nothing when suffix is empty string", () => {
        const content = "First paragraph.\n\nSecond paragraph that exceeds the limit.";
        const result = truncateMarkdown(content, 30, "");
        expect(result).toBe("First paragraph.");
    });

    it("falls back to word boundary when no paragraph boundary exists", () => {
        const content = "This is a single long line with no paragraph breaks anywhere.";
        const result = truncateMarkdown(content, 25, "...");
        expect(result).toBe("This is a single long\n\n...");
    });

    it("hard-cuts at cutOff when no word boundary exists", () => {
        const content = "abcdefghijklmnopqrstuvwxyz";
        const result = truncateMarkdown(content, 10, "...");
        expect(result).toBe("abcdefghij\n\n...");
    });

    it("backs up before a code fence when cutOff falls inside it after a paragraph boundary", () => {
        const content = ["Safe paragraph.", "", "```", "line one", "", "line two", "```", "", "After fence."].join(
            "\n",
        );
        const cutOff = content.indexOf("line one") + "line one".length;
        const result = truncateMarkdown(content, cutOff, "...");
        expect(result).toBe("Safe paragraph.\n\n...");
    });

    it("backs up before a code fence when cutOff includes partial fenced content after a paragraph boundary", () => {
        const content = ["Intro.", "", "```", "some code", "```", "", "Outro."].join("\n");
        const result = truncateMarkdown(content, content.indexOf("some code") + "some code".length, "...");
        expect(result).toBe("Intro.\n\n...");
    });

    it("backs up before a code fence when cutOff falls inside it after preceding text without a paragraph boundary", () => {
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
        const result = truncateMarkdown(content, content.indexOf("localhost"), "...");
        expect(result).toBe("A short paragraph before the code block.\nHere is an important code example:\n\n...");
    });

    it("keeps the full code fence when cutOff passes the closing fence", () => {
        const content = ["Intro.", "", "```", "some code", "```", "", "Outro."].join("\n");
        const result = truncateMarkdown(content, content.indexOf("Outro."), "...");
        expect(result).toBe("Intro.\n\n```\nsome code\n```\n\n...");
    });

    it("backs up past the fence when cutOff falls on the opening fence marker", () => {
        const content = ["Before.", "", "```", "code here", "```"].join("\n");
        const openingFenceIdx = content.indexOf("```");
        const result = truncateMarkdown(content, openingFenceIdx, "...");
        expect(result).toBe("Before.\n\n...");
    });

    it("falls back to word boundary inside a code fence and closes it", () => {
        const content = "```\nsome code line here\n```";
        const result = truncateMarkdown(content, content.indexOf("line"), "...");
        expect(result).toBe("```\nsome code\n```\n\n...");
    });

    it("cuts a table only at complete rows", () => {
        const content = ["| Name | Value |", "| --- | --- |", "| first | row |", "| second | row |"].join("\n");
        const result = truncateMarkdown(content, content.indexOf("second") + 3, "...");
        expect(result).toBe("| Name | Value |\n| --- | --- |\n| first | row |\n\n...");
    });

    it("keeps a complete list when cutOff falls after it without a paragraph boundary", () => {
        const content = [
            "You can:",
            " * configure _link targets_",
            " * add custom __rehype__ plugins",
            " * and filter content through an allowed elements list",
            "A third paragraph that continues after the list.",
        ].join("\n");
        const result = truncateMarkdown(content, content.indexOf("continues"), "...");

        expect(result).toBe(
            [
                "You can:",
                " * configure _link targets_",
                " * add custom __rehype__ plugins",
                " * and filter content through an allowed elements list",
                "",
                "...",
            ].join("\n"),
        );
    });

    it("backs up before the active list item when cutOff falls inside a list", () => {
        const content = [
            "You can:",
            " * configure _link targets_",
            " * add custom __rehype__ plugins",
            " * and filter content through an allowed elements list",
            "A third paragraph that continues after the list.",
        ].join("\n");
        const result = truncateMarkdown(content, content.indexOf("rehype"), "...");

        expect(result).toBe("You can:\n * configure _link targets_\n\n...");
    });

    it("backs up before the first list item when cutOff falls inside it", () => {
        const content = [
            "You can:",
            " * configure _link targets_",
            " * add custom __rehype__ plugins",
            " * and filter content through an allowed elements list",
            "A third paragraph that continues after the list.",
        ].join("\n");
        const result = truncateMarkdown(content, content.indexOf("configure"), "...");

        expect(result).toBe("You can:\n\n...");
    });

    it("does not cut inside inline markdown links", () => {
        const content = "Read [the guide](https://example.com/a/very/long/url) before continuing.";
        const result = truncateMarkdown(content, content.indexOf("example.com") + 4, "...");
        expect(result).toBe("Read [the guide](https://example.com/a/very/long/url)\n\n...");
    });

    it("does not include a markdown link when cutOff falls inside its description", () => {
        const content = "Read [the guide](https://example.com/a/very/long/url) before continuing.";
        const result = truncateMarkdown(content, "Read the".length, "...");
        expect(result).toBe("Read\n\n...");
    });

    it("includes the full markdown link when its description fits into cutOff", () => {
        const content = "Read [the guide](https://example.com/a/very/long/url) before continuing.";
        const result = truncateMarkdown(content, content.indexOf("example.com"), "...");
        expect(result).toBe("Read [the guide](https://example.com/a/very/long/url)\n\n...");
    });

    it("does not treat markdown links inside fences as links", () => {
        const content = [
            "```",
            "const link = '[x](https://example.com/a/very/long/url/that/does/not/render)';",
            "```",
            "",
            "After.",
        ].join("\n");
        const result = truncateMarkdown(content, content.indexOf("example.com") + 4, "...");
        expect(result).toBe("```\nconst link =\n```\n\n...");
    });

    it("keeps text before a link when cutOff reaches the link after a fence without an empty line", () => {
        const content = [
            "A short paragraph before the code block.",
            "",
            "~~~",
            "some code here",
            "~~~",
            "Continue with the [detailed implementation guide](https://example.com/docs/implementation/very/long/path) after the code block.",
        ].join("\n");
        const cutOff = content.indexOf("detailed");
        const result = truncateMarkdown(content, cutOff, "...");

        expect(result).toBe(
            "A short paragraph before the code block.\n\n~~~\nsome code here\n~~~\nContinue with the\n\n...",
        );
    });
});
