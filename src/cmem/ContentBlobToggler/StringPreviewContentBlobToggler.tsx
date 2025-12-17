import React from "react";

import { ContentBlobToggler, ContentBlobTogglerProps, InlineText, Markdown, utils } from "./../../../index";

export interface StringPreviewContentBlobTogglerProps
    extends Omit<ContentBlobTogglerProps, "previewContent" | "enableToggler"> {
    /**
     * The preview content will be cut to this length if it is too long.
     */
    previewMaxLength?: number;
    /**
     * The content string.
     * If it is smaller than `previewMaxLength` this will be displayed in full, else `fullviewContent` will be displayed.
     */
    content: string;
    /**
     * Use only parts of `content` in the preview.
     * `firstMarkdownSection` uses the content until the first double line return.
     * Currently overwritten by `firstNonEmptyLineOnly`.
     */
    useOnly?: "firstNonEmptyLine" | "firstMarkdownSection";
    /**
     * If enabled the preview is rendered as Markdown.
     */
    renderPreviewAsMarkdown?: boolean;
    /**
     * White-listing of HTML elements that will be rendered when renderPreviewAsMarkdown is enabled.
     */
    allowedHtmlElementsInPreview?: string[];
    /**
     * Allows to add non-string elements at the end of the content if the full description is shown, i.e. no toggler is necessary.
     * This allows to add non-string elements to both the full-view content and the pure string content.
     */
    noTogglerContentSuffix?: JSX.Element;
    /**
     * If only the first non-empty line should be shown in the preview.
     * This will in addition also be shortened according to `previewMaxLength`.
     * @deprecated (v26) use `useOnly="firstNonEmptyLine"` instead
     */
    firstNonEmptyLineOnly?: boolean;
}

/** Version of the content toggler for text centric content. */
export function StringPreviewContentBlobToggler({
    className = "",
    previewMaxLength,
    toggleExtendText,
    toggleReduceText,
    content,
    fullviewContent,
    startExtended,
    useOnly,
    renderPreviewAsMarkdown = false,
    allowedHtmlElementsInPreview,
    noTogglerContentSuffix,
    firstNonEmptyLineOnly,
}: StringPreviewContentBlobTogglerProps) {
    // need to test `firstNonEmptyLineOnly` until property is removed
    const useOnlyTest: StringPreviewContentBlobTogglerProps["useOnly"] = firstNonEmptyLineOnly
        ? "firstNonEmptyLine"
        : useOnly;

    let previewString = content;
    switch (useOnlyTest) {
        case "firstNonEmptyLine":
            previewString = useOnlyPart(content, regexFirstNonEmptyLine);
            break;
        case "firstMarkdownSection":
            previewString = useOnlyPart(content, regexFirstMarkdownSection);
    }

    let enableToggler = previewString !== content;

    let previewContent = renderPreviewAsMarkdown ? (
        <Markdown key="markdown-content" allowedElements={allowedHtmlElementsInPreview}>
            {previewString}
        </Markdown>
    ) : (
        previewString
    );

    if (
        previewMaxLength &&
        utils.reduceToText(previewContent, { decodeHtmlEntities: true }).length > previewMaxLength
    ) {
        previewContent = utils.reduceToText(previewContent, { decodeHtmlEntities: true }).slice(0, previewMaxLength);
        enableToggler = true;
    }

    if (!enableToggler && noTogglerContentSuffix) {
        previewContent = (
            <>
                {previewContent}
                {noTogglerContentSuffix}
            </>
        );
    }

    return (
        <ContentBlobToggler
            className={className}
            previewContent={<InlineText>{previewContent}</InlineText>}
            toggleExtendText={toggleExtendText}
            toggleReduceText={toggleReduceText}
            fullviewContent={fullviewContent}
            startExtended={startExtended}
            enableToggler={enableToggler}
        />
    );
}

const regexFirstNonEmptyLine = new RegExp("\r|\n"); // eslint-disable-line
const regexFirstMarkdownSection = new RegExp("\r\n\r\n|\n\n"); // eslint-disable-line

/**
 * Takes the first non-empty line from a preview string.
 */
function firstNonEmptyLine(preview: string) {
    return useOnlyPart(preview, regexFirstNonEmptyLine);
}

/**
 * Returns only the first part from a preview string.
 * Or the full string as fallback.
 */
function useOnlyPart(preview: string, regexTest: RegExp): string {
    const previewString = preview.trim();
    const result = regexTest.exec(previewString);
    return result !== null ? result.input.slice(0, result.index) : previewString;
}

export const stringPreviewContentBlobTogglerUtils = {
    firstNonEmptyLine,
};
