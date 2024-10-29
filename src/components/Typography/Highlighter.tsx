import React from "react";

export interface HighlighterProps {
    label?: string;
    searchValue?: string;
}

/**
 * Returns a highlighted string according to the words of the search query.
 * @param label       The string to highlight.
 * @param searchValue The mutli-word search query from which single words should be highlighted in the label.
 */
export function Highlighter({ label, searchValue }: HighlighterProps) {
    return <>{getSearchHighlight(label, searchValue)}</>;
}

const getSearchHighlight = (label?: string, searchValue?: string) => {
    if (!searchValue || !label) {
        return label;
    }

    const searchStringParts = extractSearchWords(searchValue);
    if (searchStringParts.length === 0) {
        return label;
    }
    const multiWordRegex = createMultiWordRegex(searchStringParts);
    const result: any[] = [];

    let offset = 0;
    // loop through matches and add unmatched and matched parts to result array
    let matchArray = multiWordRegex.exec(label);
    let key = 0;
    while (matchArray !== null) {
        key++;
        result.push(label.slice(offset, matchArray.index));
        result.push(<mark key={key}>{matchArray[0]}</mark>);
        offset = multiWordRegex.lastIndex;
        matchArray = multiWordRegex.exec(label);
    }
    // Add remaining unmatched string
    result.push(label.slice(offset));
    return result;
};

/** Escapes strings to match literally.
 *  taken from https://stackoverflow.com/questions/6318710/javascript-equivalent-of-perls-q-e-or-quotemeta
 */
const escapeRegexWord = (str: string) => {
    return str.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/**
 * Extracts search words separated by white space.
 */
function extractSearchWords(textQuery: string, toLowerCase = false): string[] {
    const words = textQuery.split(RegExp("\\s+")).filter((word) => word !== "");
    return toLowerCase ? words.map((w) => w.toLowerCase()) : words;
}

/**
 * Returns true if all search words are included in the given text
 */
function matchesAllWords(text: string, searchWords: string[]): boolean {
    return searchWords.every((w) => text.includes(w));
}

/**
 * Creates a case-insensitive multi-word regex, that matches any of the given words.
 */
function createMultiWordRegex(multiWordQuery: string[], global = true) {
    const regexString = multiWordQuery.map(escapeRegexWord).join("|");
    return RegExp(regexString, (global ? "g" : "") + "i");
}

export const highlighterUtils = {
    extractSearchWords,
    matchesAllWords,
    createMultiWordRegex,
};

export default Highlighter;
