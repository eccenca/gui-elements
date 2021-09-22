import React, { useState } from "react";
import { HtmlContentBlock, Link } from "../../../index";

interface IContentBlobTogglerProps extends React.HTMLAttributes<HTMLDivElement> {
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
    textToggleExtend: string;
    /**
        text label used for toggler when full view is displayed
    */
    textToggleReduce: string;
    /**
        content that is displayed as preview
    */
    previewContent: React.ReactNode;
    /**
        content that is displayed as extended full view
    */
    fullviewContent: React.ReactNode;
    /** render function that could alter the preview content.
     * Default: For string previews it only displays the first non-empty line. */
    renderPreview?: (content: React.ReactNode, maxLength: number | undefined) => React.ReactNode;
    /**
        render function that could alter full view content, e.g. processing markdown content
    */
    renderFullview?: (content: React.ReactNode) => React.ReactNode;
    /**
        show extended full view initially
    */
    startExtended?: boolean;
    /**
        Callback if toggler is necessary
    */
    enableToggler?: (
        previewSource: React.ReactNode,
        previewRendered: React.ReactNode,
        previewMaxLength: number | undefined,
        fullviewSource: React.ReactNode,
        fullviewRendered: React.ReactNode
    ) => boolean;
}

const simpleCheckToggler = (
    previewSource,
    previewRendered,
    previewMaxLength,
    fullviewSource,
    fullviewRendered
) => {
    if (previewRendered === fullviewRendered) {
        return false;
    }
    return true;
}

export function ContentBlobToggler({
    className = "",
    previewMaxLength,
    textToggleExtend,
    textToggleReduce,
    previewContent,
    fullviewContent,
    renderFullview = (content) => {
        return content;
    },
    renderPreview = (content, maxLength) => {
        if (!!maxLength && maxLength > 0 && typeof content === "string") {
            return content.substr(0, maxLength);
        }
        return content;
    },
    startExtended = false,
    enableToggler = simpleCheckToggler,
    ...otherProps
}: IContentBlobTogglerProps) {
    const [isExtended, setViewState] = useState(startExtended);
    const handlerToggleView = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setViewState(!isExtended);
    };

    const renderedPreviewContent = renderPreview(previewContent, previewMaxLength);
    const renderedFullviewContent = renderFullview(fullviewContent);
    const showToggler = enableToggler(
        previewContent,
        renderedPreviewContent,
        previewMaxLength,
        fullviewContent,
        renderedFullviewContent
    );

    return (
        <div className={className} {...otherProps}>
            <HtmlContentBlock>
                {!isExtended ? (
                    <>
                        {renderedPreviewContent}
                        {showToggler && (
                            <>
                                &hellip;
                                {" "}
                                <Link
                                    href="#more"
                                    onClick={(e) => {
                                        handlerToggleView(e);
                                    }}
                                >
                                    {textToggleExtend}
                                </Link>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {renderedFullviewContent}
                        {showToggler && (
                            <p>
                                <Link
                                    href="#less"
                                    onClick={(e) => {
                                        handlerToggleView(e);
                                    }}
                                >
                                    {textToggleReduce}
                                </Link>
                            </p>
                        )}
                    </>
                )}
            </HtmlContentBlock>
        </div>
    );
}
