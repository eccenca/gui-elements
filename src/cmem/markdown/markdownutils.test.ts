import utils from "./markdown.utils";

describe("Markdown utils", () => {
    it("should extract named anchors from the Markdown", () => {
        const namedAnchors = utils.extractNamedAnchors(
            '# Header\n\nsome text\n\n## <a  id="anchor1" ></a> point 1\n\n## <a id="anchor2"></a> point 2',
        );
        expect(namedAnchors).toStrictEqual(["anchor1", "anchor2"]);
    });

    it("should not extract named anchors from the Markdown that are not following the expected format", () => {
        const namedAnchors = utils.extractNamedAnchors(
            '# <a id="anchor" href="http://">link text</a> \n\n## <a name="test" id="anchor2"></a> point 2',
        );
        expect(namedAnchors).toStrictEqual([]);
    });
});

describe("truncateMarkdown", () => {
    const { truncateMarkdown } = utils;

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

    it("skips \\n\\n inside a code fence and backs up to pre-fence boundary", () => {
        const content = ["Safe paragraph.", "", "```", "line one", "", "line two", "```", "", "After fence."].join(
            "\n"
        );
        const fenceStart = content.indexOf("```");
        const cutOff = fenceStart + 15; // somewhere inside the fence
        const result = truncateMarkdown(content, cutOff, "...");
        expect(result).toBe("Safe paragraph.\n\n...");
    });

    it("backs up past the fence when cutOff falls on the closing fence marker", () => {
        const content = ["Intro.", "", "```", "some code", "```", "", "Outro."].join("\n");
        const closingFenceIdx = content.lastIndexOf("```");
        const result = truncateMarkdown(content, closingFenceIdx, "...");
        expect(result).toBe("Intro.\n\n...");
    });

    it("backs up past the fence when cutOff falls on the opening fence marker", () => {
        const content = ["Before.", "", "```", "code here", "```"].join("\n");
        const openingFenceIdx = content.indexOf("```");
        const result = truncateMarkdown(content, openingFenceIdx, "...");
        expect(result).toBe("Before.\n\n...");
    });

    it("falls back to word boundary when content is entirely one code fence", () => {
        const content = "```\nsome code line here\n```";
        const result = truncateMarkdown(content, 15, "...");
        expect(result).toBe("```\nsome code\n\n...");
    });
});
