import React from "react";

import { reduceToText } from "../../common/utils/reduceToText";

import { Markdown } from "./Markdown";

/** Extracts visible Markdown text and collapses whitespace to a single line. */
export const markdownToText = (markdown: string): string => {
    if (!markdown.trim()) {
        return "";
    }

    return reduceToText(
        <Markdown inheritBlock removeMarkup allowedElements={[]}>
            {markdown}
        </Markdown>,
        { decodeHtmlEntities: true },
    ).replace(/\s+/g, " ");
};
