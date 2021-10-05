import React from "react";
import {ContentBlobToggler} from "@gui-elements/src/cmem/ContentBlobToggler/ContentBlobToggler";

interface IStringPreviewContentBlobTogglerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     space-delimited list of class names
     */
    className?: string;
    /**
     when the preview content is a string then it will be cut to this length
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
     content that is displayed as preview
     */
    previewContent: string;
    /**
     content that is displayed as extended full view
     */
    fullviewContent: React.ReactNode;
    /**
     show extended full view initially
     */
    startExtended?: boolean;
    /** If only the first non-empty line should be shown in the preview. This will in addition also be shortened according to previewMaxLength. */
    firstNonEmptyLineOnly?: boolean
}

/** Version of the content toggler that has a string-only preview.*/
export function StringPreviewContentBlobToggler({
                                                    className = "",
                                                    previewMaxLength,
                                                    toggleExtendText,
                                                    toggleReduceText,
                                                    previewContent,
                                                    fullviewContent,
                                                    startExtended,
                                                    firstNonEmptyLineOnly
                                                }: IStringPreviewContentBlobTogglerProps) {
    const previewMaybeFirstLine = firstNonEmptyLineOnly ? firstNonEmptyLine(previewContent) : previewContent
    const previewString = previewMaxLength ? previewMaybeFirstLine.substr(0, previewMaxLength) : previewMaybeFirstLine
    const enableToggler = previewString !== fullviewContent

    return <ContentBlobToggler
        className={className}
        previewContent={previewString}
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
