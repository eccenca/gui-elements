import React from "react";

import { Markdown, MarkdownProps } from "../../cmem/markdown/Markdown";

import { reduceToText } from "./reduceToText";
import { truncateMarkdownDisplay } from "./truncateMarkdownDisplay";

const measureLength = (node: React.ReactElement): number => reduceToText(node).length;

const makeMarkdown = (children: string, cutOff: number, extra?: Partial<MarkdownProps>) =>
    React.createElement(Markdown, { children, cutOff, ...extra }) as React.ReactElement<
        MarkdownProps & { cutOff: number }
    >;

describe("truncateMarkdownDisplay", () => {
    it("returns the untruncated element when the rendered content is already shorter than cutOff", () => {
        const input = makeMarkdown("Short text.", 1000);
        const result = truncateMarkdownDisplay(input);
        expect((result.props as MarkdownProps).cutOff).toBeUndefined();
    });

    it("returns an element whose rendered text length is closer to cutOff than the raw cutOff would yield", () => {
        // Markdown link syntax: rendered text "click" is 5 chars, raw syntax is 30+ chars.
        const linkHeavy = Array.from({ length: 20 }, (_, i) => `[click](https://example.com/${i})`).join(" ");
        const cutOff = 60;

        const rawTruncatedLength = measureLength(makeMarkdown(linkHeavy, cutOff));
        const refined = truncateMarkdownDisplay(makeMarkdown(linkHeavy, cutOff));
        const refinedLength = measureLength(refined);

        expect(rawTruncatedLength).toBeLessThan(cutOff);
        expect(refinedLength).toBeGreaterThan(rawTruncatedLength);
        expect(Math.abs(refinedLength - cutOff)).toBeLessThanOrEqual(Math.abs(rawTruncatedLength - cutOff));
    });

    it("preserves other props of the input element on the returned element", () => {
        const linkHeavy = Array.from({ length: 20 }, (_, i) => `[click](https://example.com/${i})`).join(" ");
        const input = makeMarkdown(linkHeavy, 40, { "data-test-id": "md-x", allowHtml: true });
        const result = truncateMarkdownDisplay(input);
        const props = result.props as MarkdownProps;
        expect(props["data-test-id"]).toBe("md-x");
        expect(props.allowHtml).toBe(true);
    });

    it("returns an element whose cutOff differs from the initial cutOff when iteration adjusts it", () => {
        const linkHeavy = Array.from({ length: 20 }, (_, i) => `[click](https://example.com/${i})`).join(" ");
        const initialCutOff = 50;
        const result = truncateMarkdownDisplay(makeMarkdown(linkHeavy, initialCutOff));
        const props = result.props as MarkdownProps;
        // Either the element was kept (initial was already best) or cutOff was raised to compensate for syntax overhead.
        expect(props.cutOff === undefined || (typeof props.cutOff === "number" && props.cutOff >= initialCutOff)).toBe(
            true,
        );
    });

    it("passes reduceToTextOptions through to the internal text measurement", () => {
        // With decodeHtmlEntities enabled, entity-heavy content reduces to a shorter measured length,
        // so the function should treat its length as shorter and may take the early-exit path.
        const content = "&amp; &amp; &amp; &amp; &amp; &amp; &amp; &amp;";
        const cutOff = 30;
        const input = makeMarkdown(content, cutOff);
        const resultDecoded = truncateMarkdownDisplay(input, { decodeHtmlEntities: true });
        expect((resultDecoded.props as MarkdownProps).cutOff).toBeUndefined();
    });

    it("respects maxRounds by not iterating when set to 0", () => {
        const linkHeavy = Array.from({ length: 20 }, (_, i) => `[click](https://example.com/${i})`).join(" ");
        const initialCutOff = 50;
        const input = makeMarkdown(linkHeavy, initialCutOff);
        const result = truncateMarkdownDisplay(input, undefined, 0);
        // With no iterations allowed, the result should be the initial element (same cutOff as the input).
        expect((result.props as MarkdownProps).cutOff).toBe(initialCutOff);
    });
});
