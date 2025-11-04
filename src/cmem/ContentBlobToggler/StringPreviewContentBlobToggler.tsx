import React from "react";

import { ContentBlobToggler, ContentBlobTogglerProps, Markdown } from "./..";
import { TextReducer } from "../../components";

export interface StringPreviewContentBlobTogglerProps
    extends Omit<ContentBlobTogglerProps, "previewContent" | "enableToggler"> {
    /**
     The preview content will be cut to this length if it is too long.
     */
    previewMaxLength?: number;
    /**
     The content string. If it is smaller than previewMaxLength this will be displayed in full, else fullviewContent will be displayed.
     */
    content: string;
    /** If only the first non-empty line should be shown in the preview. This will in addition also be shortened according to previewMaxLength. */
    firstNonEmptyLineOnly?: boolean;
    /** If enabled the preview is rendered as markdown. */
    renderPreviewAsMarkdown?: boolean;
    /** White-listing of HTML elements that will be rendered when renderPreviewAsMarkdown is enabled. */
    allowedHtmlElementsInPreview?: string[];
    /** Allows to add non-string elements at the end of the content if the full description is shown, i.e. no toggler is necessary.
     * This allows to add non-string elements to both the full-view content and the pure string content.
     */
    noTogglerContentSuffix?: JSX.Element;
}

/** Version of the content toggler for text only content. */
export function StringPreviewContentBlobToggler({
    className = "",
    previewMaxLength,
    toggleExtendText,
    toggleReduceText,
    content,
    fullviewContent,
    startExtended,
    firstNonEmptyLineOnly,
    renderPreviewAsMarkdown = false,
    allowedHtmlElementsInPreview,
    noTogglerContentSuffix,
}: StringPreviewContentBlobTogglerProps) {
    const previewMaybeFirstLine = firstNonEmptyLineOnly ? firstNonEmptyLine(content) : content;
    const enableToggler = (previewMaxLength ?? Infinity) < content.length;
    let previewContent = renderPreviewAsMarkdown ? (
        <TextReducer maxLength={previewMaxLength}>
            <Markdown key="markdown-content" allowedElements={allowedHtmlElementsInPreview}>
                {previewMaybeFirstLine}
            </Markdown>
        </TextReducer>
    ) : (
        previewMaybeFirstLine
    );
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
            previewContent={previewContent}
            toggleExtendText={toggleExtendText}
            toggleReduceText={toggleReduceText}
            fullviewContent={fullviewContent}
            startExtended={startExtended}
            enableToggler={enableToggler}
        />
    );
}

const newLineRegex = new RegExp("\r|\n"); // eslint-disable-line

/**
 * Takes the first non-empty line from a preview string.
 */
function firstNonEmptyLine(preview: string) {
    const previewString = preview.trim();
    const result = newLineRegex.exec(previewString);
    return result !== null ? previewString.substr(0, result.index) : previewString;
}

export const stringPreviewContentBlobTogglerUtils = {
    firstNonEmptyLine,
};
