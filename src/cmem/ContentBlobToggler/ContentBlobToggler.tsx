import React, { useState } from "react";

import Link from "../../components/Link/Link";
import Spacing from "../../components/Separation/Spacing";
import InlineText from "../../components/Typography/InlineText";

export interface ContentBlobTogglerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
        space-delimited list of class names
    */
    className?: string;
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
    previewContent: React.ReactNode;
    /**
        content that is displayed as extended full view
    */
    fullviewContent: React.ReactNode;
    /**
        Show extended full view initially. Default: false
    */
    startExtended?: boolean;
    /**
        Callback if toggler is necessary. Default: true
    */
    enableToggler?: boolean;
    /**
     * Force always inline rendering.
     */
    forceInline?: boolean;
}

/** Shows a preview with the option to expand to a full view (and back). */
export function ContentBlobToggler({
    className = "",
    toggleExtendText,
    toggleReduceText,
    previewContent,
    fullviewContent,
    startExtended = false,
    enableToggler = true,
    forceInline = false,
    ...otherProps
}: ContentBlobTogglerProps) {
    const [isExtended, setViewState] = useState(startExtended);
    const handlerToggleView = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setViewState(!isExtended);
    };

    const tooglerDisplay = (
        <div className={className} {...otherProps}>
            {!isExtended ? (
                <>
                    {previewContent}
                    {enableToggler && (
                        <>
                            {" "}
                            &hellip;{" "}
                            <Link
                                href="#more"
                                data-test-id={"content-blob-toggler-more-link"}
                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    handlerToggleView(e);
                                }}
                            >
                                {toggleExtendText}
                            </Link>
                        </>
                    )}
                </>
            ) : (
                <>
                    {fullviewContent}
                    {enableToggler && (
                        <div>
                            {forceInline ? <> </> : <Spacing size="small" />}
                            <Link
                                data-test-id={"content-blob-toggler-less-link"}
                                href="#less"
                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    handlerToggleView(e);
                                }}
                            >
                                {toggleReduceText}
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    return forceInline ? <InlineText>{tooglerDisplay}</InlineText> : tooglerDisplay;
}
