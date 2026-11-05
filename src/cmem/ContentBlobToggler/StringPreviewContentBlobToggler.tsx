import React from "react";

import { utils } from "../../common";
import InlineText from "../../components/Typography/InlineText";
import { Markdown, markdownAllowedInlineElements } from "../markdown/Markdown";

import { ContentBlobToggler, ContentBlobTogglerProps } from "./ContentBlobToggler";

export interface StringPreviewContentBlobTogglerProps extends Omit<
    ContentBlobTogglerProps,
    "previewContent" | "enableToggler"
> {
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
    noTogglerContentSuffix?: React.JSX.Element;
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
    allowedHtmlElementsInPreview = markdownAllowedInlineElements,
    noTogglerContentSuffix,
    ...otherContentBlobTogglerProps
}: StringPreviewContentBlobTogglerProps) {
    let previewString = content;
    switch (useOnly) {
        case "firstNonEmptyLine":
            previewString = useOnlyPart(content, regexFirstNonEmptyLine);
            break;
        case "firstMarkdownSection":
            previewString = useOnlyPart(content, regexFirstMarkdownSection);
    }

    // Measuring and truncating a Markdown preview renders the Markdown multiple times to static markup, so it is only
    // re-calculated if one of its inputs changes, and not on every re-render, e.g. of a long list containing togglers.
    const { truncatedPreviewContent, isTruncated } = React.useMemo((): {
        truncatedPreviewContent: React.JSX.Element | string;
        isTruncated: boolean;
    } => {
        if (!renderPreviewAsMarkdown) {
            if (previewMaxLength) {
                const previewText = utils.reduceToText(previewString, { decodeHtmlEntities: true });
                if (previewText.length > previewMaxLength) {
                    return { truncatedPreviewContent: previewText.slice(0, previewMaxLength), isTruncated: true };
                }
            }
            return { truncatedPreviewContent: previewString, isTruncated: false };
        }

        if (!previewMaxLength) {
            return {
                truncatedPreviewContent: (
                    <Markdown key="markdown-content" allowedElements={allowedHtmlElementsInPreview}>
                        {previewString}
                    </Markdown>
                ),
                isTruncated: false,
            };
        }

        // `truncateMarkdownDisplay` already measures the complete Markdown display first and returns it without
        // `cutOff` if it is short enough, so it is not measured here a second time.
        const markdownPreview = utils.truncateMarkdownDisplay(
            <Markdown
                key="markdown-content"
                allowedElements={allowedHtmlElementsInPreview}
                cutOff={previewMaxLength}
                cutOffSuffix={""}
            >
                {previewString}
            </Markdown>,
            { decodeHtmlEntities: true },
        );
        return {
            truncatedPreviewContent: markdownPreview,
            isTruncated: markdownPreview.props.cutOff !== undefined,
        };
    }, [previewString, previewMaxLength, renderPreviewAsMarkdown, allowedHtmlElementsInPreview]);

    const enableToggler = previewString !== content || isTruncated;
    let previewContent = truncatedPreviewContent;

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
            {...otherContentBlobTogglerProps}
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
