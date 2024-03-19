import { createMultiWordRegex, extractSearchWords, matchesAllWords } from "./Highlighter";

// @deprecated use `highlighterUtils`
export const HighlighterFunctions = {
    extractSearchWords,
    matchesAllWords,
    createMultiWordRegex,
};

export * from "./Highlighter";
export * from "./HtmlContentBlock";
export * from "./OverflowText";
export * from "./WhiteSpaceContainer";
