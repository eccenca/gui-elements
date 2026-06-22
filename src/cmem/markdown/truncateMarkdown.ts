interface FenceRange {
    start: number;
    contentStart: number;
    contentEnd: number;
    end: number;
    marker: string;
}

interface LinkRange {
    start: number;
    descriptionEnd: number;
    end: number;
}

interface ParagraphRange {
    start: number;
    end: number;
}

interface ListItemRange {
    start: number;
    end: number;
}

const getFenceRanges = (content: string): FenceRange[] => {
    const fenceRanges: FenceRange[] = [];
    const fenceRegex = /^[ ]{0,3}([`~]{3,})[^\n]*(?:\n|$)/gm;
    let fenceMatch = fenceRegex.exec(content);

    while (fenceMatch !== null) {
        // Keep the original marker so a truncated fence is closed with the same marker style.
        const marker = fenceMatch[1];
        const start = fenceMatch.index;
        const contentStart = fenceRegex.lastIndex;
        const closeRegex = new RegExp(`^[ ]{0,3}${marker[0]}{${marker.length},}\\s*$`, "gm");
        closeRegex.lastIndex = contentStart;
        const closeMatch = closeRegex.exec(content);
        const contentEnd = closeMatch ? closeMatch.index : content.length;
        const end = closeMatch ? closeMatch.index + closeMatch[0].length : content.length;

        fenceRanges.push({ start, contentStart, contentEnd, end, marker });
        fenceRegex.lastIndex = end;
        fenceMatch = fenceRegex.exec(content);
    }

    return fenceRanges;
};

const isInsideFence = (fenceRanges: FenceRange[], pos: number): boolean =>
    fenceRanges.some(({ start, end }) => pos > start && pos < end);

const truncateActiveFence = (content: string, cutOff: number, activeFence: FenceRange): string => {
    const desiredEnd = Math.min(cutOff, activeFence.contentEnd);
    const lastSpace = content.lastIndexOf(" ", desiredEnd);
    const lastLineBreak = content.lastIndexOf("\n", desiredEnd);
    const lastTab = content.lastIndexOf("\t", desiredEnd);
    const lastWhitespace = Math.max(lastSpace, lastLineBreak, lastTab);
    const partialEnd =
        desiredEnd < activeFence.contentEnd && lastWhitespace >= activeFence.contentStart ? lastWhitespace : desiredEnd;
    const truncatedFence = content.slice(0, partialEnd).trimEnd();
    return `${truncatedFence}\n${activeFence.marker}`;
};

const getLinkRanges = (content: string, fenceRanges: FenceRange[]): LinkRange[] => {
    const linkRanges: LinkRange[] = [];
    const linkRegex = /!?\[[^\]\n]*\]\([^) \n]+(?:\s+"[^"\n]*")?\)/g;
    let linkMatch = linkRegex.exec(content);

    while (linkMatch !== null) {
        const start = linkMatch.index;
        const end = start + linkMatch[0].length;
        if (!isInsideFence(fenceRanges, start)) {
            const linkStart = start + linkMatch[0].indexOf("(");
            linkRanges.push({ start, descriptionEnd: linkStart - 1, end });
        }
        linkRegex.lastIndex = end;
        linkMatch = linkRegex.exec(content);
    }

    return linkRanges;
};

const moveCutOffOutsideLink = (cutOff: number, linkRanges: LinkRange[]): number => {
    const activeLink = linkRanges.find(({ start, end }) => cutOff > start && cutOff < end);
    if (!activeLink) {
        return cutOff;
    }

    return cutOff <= activeLink.descriptionEnd ? activeLink.start : activeLink.end;
};

const getParagraphRanges = (content: string): ParagraphRange[] => {
    const paragraphRanges: ParagraphRange[] = [];
    const paragraphRegex = /\n\s*\n/g;
    let paragraphMatch = paragraphRegex.exec(content);

    while (paragraphMatch !== null) {
        paragraphRanges.push({
            start: paragraphMatch.index,
            end: paragraphMatch.index + paragraphMatch[0].length,
        });
        paragraphMatch = paragraphRegex.exec(content);
    }

    return paragraphRanges;
};

const getLastParagraphRangeBeforeCutOff = (
    paragraphRanges: ParagraphRange[],
    cutOff: number,
    fenceRanges: FenceRange[],
): number => {
    let cutPoint = -1;
    for (const paragraphRange of paragraphRanges) {
        if (paragraphRange.end > cutOff) break;
        if (!isInsideFence(fenceRanges, paragraphRange.end)) {
            cutPoint = paragraphRange.end;
        }
    }
    return cutPoint;
};

const getListItemRanges = (content: string, fenceRanges: FenceRange[]): ListItemRange[] => {
    const listItemRanges: ListItemRange[] = [];
    const listItemRegex = /^\s*(?:[-+*]\s+|\d+[.)]\s+)/;
    let activeListItemRange: ListItemRange | undefined;
    let lineStart = 0;

    while (lineStart < content.length) {
        const lineBreak = content.indexOf("\n", lineStart);
        const lineEnd = lineBreak === -1 ? content.length : lineBreak;
        const nextLineStart = lineBreak === -1 ? content.length : lineBreak + 1;
        const line = content.slice(lineStart, lineEnd);
        const isListItem = listItemRegex.test(line) && !isInsideFence(fenceRanges, lineStart);
        const isListContinuation = Boolean(activeListItemRange && line.trim() && /^\s+/.test(line));

        if (isListItem) {
            if (activeListItemRange) {
                listItemRanges.push(activeListItemRange);
            }
            activeListItemRange = { start: lineStart, end: nextLineStart };
        } else if (activeListItemRange && isListContinuation) {
            activeListItemRange.end = nextLineStart;
        } else if (activeListItemRange) {
            listItemRanges.push(activeListItemRange);
            activeListItemRange = undefined;
        }

        lineStart = nextLineStart;
    }

    if (activeListItemRange) {
        listItemRanges.push(activeListItemRange);
    }

    return listItemRanges;
};

const getLastListItemRangeEndBeforeCutOff = (listItemRanges: ListItemRange[], cutOff: number): number => {
    let cutPoint = -1;
    for (const listItemRange of listItemRanges) {
        if (listItemRange.end > cutOff) break;
        cutPoint = listItemRange.end;
    }
    return cutPoint;
};

/**
 * Truncates a Markdown string at a safe raw boundary.
 * It keeps links atomic, prefers boundaries outside structured blocks, and closes a partial fenced code block only
 * when no safer boundary exists. Display-length refinement is handled by `truncateMarkdownDisplay`.
 */
export const truncateMarkdown = (content: string, cutOff: number, suffix?: string): string => {
    if (!cutOff || cutOff <= 0 || content.length <= cutOff) {
        return content;
    }

    const appendSuffix = (truncated: string) => (suffix ? `${truncated.trimEnd()}\n\n${suffix}` : truncated.trimEnd());
    const fenceRanges = getFenceRanges(content);
    const linkRanges = getLinkRanges(content, fenceRanges);
    const listItemRanges = getListItemRanges(content, fenceRanges);
    const safeCutOff = moveCutOffOutsideLink(cutOff, linkRanges);

    if (safeCutOff >= content.length) {
        return content;
    }

    if (linkRanges.some(({ start }) => safeCutOff === start)) {
        return appendSuffix(content.slice(0, safeCutOff));
    }

    if (linkRanges.some(({ end }) => safeCutOff === end)) {
        return appendSuffix(content.slice(0, safeCutOff));
    }

    let cutPoint = getLastParagraphRangeBeforeCutOff(getParagraphRanges(content), safeCutOff, fenceRanges);
    const listBoundary = getLastListItemRangeEndBeforeCutOff(listItemRanges, safeCutOff);
    if (listBoundary > cutPoint) {
        cutPoint = listBoundary;
    }

    const activeListItem = listItemRanges.find(({ start, end }) => safeCutOff > start && safeCutOff < end);
    if (activeListItem) {
        const cutBeforeListItem = activeListItem.start > 0 && content.slice(0, activeListItem.start).trim().length > 0;
        if (cutPoint !== -1 || cutBeforeListItem) {
            return appendSuffix(content.slice(0, cutBeforeListItem ? activeListItem.start : cutPoint));
        }
    }

    if (cutPoint === -1) {
        const lineBoundary = content.lastIndexOf("\n", safeCutOff);
        if (lineBoundary > 0 && !isInsideFence(fenceRanges, lineBoundary)) {
            cutPoint = lineBoundary;
        }
    }

    const activeFence = fenceRanges.find(({ start, end }) => safeCutOff > start && safeCutOff < end);
    if (activeFence) {
        const cutBeforeFence = activeFence.start > 0 && content.slice(0, activeFence.start).trim().length > 0;
        if (cutPoint !== -1 || cutBeforeFence) {
            return appendSuffix(content.slice(0, cutBeforeFence ? activeFence.start : cutPoint));
        }

        return appendSuffix(truncateActiveFence(content, safeCutOff, activeFence));
    }

    if (cutPoint === -1) {
        const lastSpace = content.lastIndexOf(" ", safeCutOff);
        cutPoint = lastSpace > 0 ? lastSpace : safeCutOff;
    }

    if (cutPoint <= 0) {
        cutPoint = safeCutOff > 0 ? safeCutOff : cutOff;
    }

    return appendSuffix(content.slice(0, cutPoint));
};
