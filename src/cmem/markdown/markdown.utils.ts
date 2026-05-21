/** Extracts the values of all named anchors used in the Markdown string, i.e. of the form <mark name="<value>"></mark>. */
const extractNamedAnchors = (markdown: string): string[] => {
    const regex = new RegExp('<a\\s+id="([^"]+)"\\s*>[^<]*</a>', "g");
    const namedAnchors: string[] = [];

    let results = regex.exec(markdown);
    while (results !== null) {
        namedAnchors.push(results[1]);
        results = regex.exec(markdown);
    }
    return namedAnchors;
};

/**
 * Truncates a markdown string at a safe block boundary before the cutOff character limit.
 * Avoids cutting inside code fences. Falls back to word boundary or hard cut if no
 * safe paragraph boundary exists.
 */
const truncateMarkdown = (content: string, cutOff: number, suffix?: string): string => {
    if (!cutOff || cutOff <= 0 || content.length <= cutOff) {
        return content;
    }

    // Collect [start, end] index pairs of all triple-backtick code fence regions
    const codeFenceRegex = /^(`{3,})[^\n]*\n[\s\S]*?\n\1/gm;
    const fenceRanges: [number, number][] = [];
    let m: RegExpExecArray | null;
    while ((m = codeFenceRegex.exec(content)) !== null) {
        fenceRanges.push([m.index, m.index + m[0].length]);
    }

    // Also handle unclosed fences (opener with no matching close, or closed with
    // a different-length backtick run than what this regex requires)
    const openMarkerRegex = /^`{3,}[^\n]*/gm;
    let lastUnclosedStart = -1;
    let om: RegExpExecArray | null;
    while ((om = openMarkerRegex.exec(content)) !== null) {
        const pos = om.index;
        if (!fenceRanges.some(([s, e]) => pos >= s && pos < e)) {
            lastUnclosedStart = pos;
        }
    }
    if (lastUnclosedStart !== -1) {
        fenceRanges.push([lastUnclosedStart, content.length]);
    }

    const isInsideFence = (pos: number): boolean => fenceRanges.some(([start, end]) => pos >= start && pos < end);

    // Walk backward from cutOff to find the last \n\n not inside a code fence
    let searchFrom = cutOff;
    let cutPoint = -1;
    while (searchFrom > 0) {
        const idx = content.lastIndexOf("\n\n", searchFrom);
        if (idx === -1) break;
        if (!isInsideFence(idx)) {
            cutPoint = idx;
            break;
        }
        searchFrom = idx - 1;
    }

    // Fallback: last word boundary before cutOff
    if (cutPoint === -1) {
        const lastSpace = content.lastIndexOf(" ", cutOff);
        cutPoint = lastSpace > 0 ? lastSpace : cutOff;
    }

    // Avoid returning just the suffix with no content
    if (cutPoint <= 0) {
        cutPoint = cutOff;
    }

    const truncated = content.slice(0, cutPoint).trimEnd();
    return suffix ? `${truncated}\n\n${suffix}` : truncated;
};

const utils = {
    extractNamedAnchors,
    truncateMarkdown,
};

export default utils;
