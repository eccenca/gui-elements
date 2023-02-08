import Highlighter, { HighlighterProps } from "./Highlighter";
import { extractSearchWords, matchesAllWords, createMultiWordRegex } from "./Highlighter";
import HtmlContentBlock, { HtmlContentBlockProps } from "./HtmlContentBlock";
import OverflowText, { OverflowTextProps } from "./OverflowText";
import WhiteSpaceContainer, { WhiteSpaceContainerProps } from "./WhiteSpaceContainer";

export type {
    HighlighterProps,
    HtmlContentBlockProps,
    OverflowTextProps,
    WhiteSpaceContainerProps
};

export {
    Highlighter,
    HtmlContentBlock,
    OverflowText,
    WhiteSpaceContainer,
};

export const HighlighterFunctions = {
    extractSearchWords,
    matchesAllWords,
    createMultiWordRegex,
};
