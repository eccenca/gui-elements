import React from "react";
import { ContentBlobToggler, Markdown } from "./..";

interface IStringPreviewContentBlobTogglerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     space-delimited list of class names
     */
    className?: string;
    /**
     The preview content will be cut to this length if it is too long.
     */
    previewMaxLength?: number;
    /**
     text label used for toggler when preview is displayed
     */
    toggleExtendText: string;
    /**
     text label used for toggler when full view is displayed
     */
    toggleReduceText: string;
    /**
     The content string. If it is smaller than previewMaxLength this will be displayed in full, else fullviewContent will be displayed.
     */
    content: string;
    /**
     Content that is displayed as extended full view
     */
    fullviewContent: React.ReactNode;
    /**
     show extended full view initially
     */
    startExtended?: boolean;
    /** If only the first non-empty line should be shown in the preview. This will in addition also be shortened according to previewMaxLength. */
    firstNonEmptyLineOnly?: boolean
    /** If enabled the preview is rendered as markdown. */
    renderPreviewAsMarkdown?: boolean
    /** White-listing of HTML elements that will be rendered when renderPreviewAsMarkdown is enabled. */
    allowedHtmlElementsInPreview?: string[]
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
                                                    allowedHtmlElementsInPreview
                                                }: IStringPreviewContentBlobTogglerProps) {
    const previewMaybeFirstLine = firstNonEmptyLineOnly ? firstNonEmptyLine(content) : content
    const previewString = previewMaxLength ? previewMaybeFirstLine.substr(0, previewMaxLength) : previewMaybeFirstLine
    const enableToggler = previewString !== content

    return <ContentBlobToggler
        className={className}
        previewContent={renderPreviewAsMarkdown ? <Markdown allowedElements={allowedHtmlElementsInPreview}>{previewString}</Markdown> : previewString}
        toggleExtendText={toggleExtendText}
        toggleReduceText={toggleReduceText}
        fullviewContent={fullviewContent}
        startExtended={startExtended}
        enableToggler={enableToggler}
    />
}

const newLineRegex = new RegExp("\r|\n"); // eslint-disable-line

/** Takes the first non-empty line from a preview string. */
export function firstNonEmptyLine(preview: string) {
    const previewString = preview.trim();
    const result = newLineRegex.exec(previewString);
    return result !== null ? previewString.substr(0, result.index) : previewString;
}
