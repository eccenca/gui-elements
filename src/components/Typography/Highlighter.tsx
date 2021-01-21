import React from "react";

interface IHighlighterProps {
    label: string;
    searchValue: string;
}

/**
 * Returns a highlighted string according to the words of the search query.
 * @param label       The string to highlight.
 * @param searchValue The mutli-word search query from which single words should be highlighted in the label.
 */
function Highlighter({ label, searchValue }: IHighlighterProps) {
    return <>{getSearchHighlight(label, searchValue)}</>;
}

const getSearchHighlight = (label: string, searchValue: string) => {
    if (!searchValue || !label) {
        return label;
    }

    const searchStringParts = extractSearchWords(searchValue);
    if (searchStringParts.length === 0) {
        return label;
    }
    const multiWordRegex = createMultiWordRegex(searchStringParts);
    const result = [];

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

/** Extracts search words separated by white space. */
export function extractSearchWords(textQuery: string): string[] {
    return textQuery.split(RegExp("\\s+")).filter((word) => word !== "");
}

/** Creates a case-insensitive multi-word regex, that matches any of the given words. */
export function createMultiWordRegex(multiWordQuery: string[]) {
    const regexString = multiWordQuery.map(escapeRegexWord).join("|");
    return RegExp(regexString, "gi");
}

export default Highlighter;
