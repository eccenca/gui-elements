import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

type SvgDepiction = HTMLElement & SVGElement;
type ImgDepiction = HTMLElement & HTMLImageElement;

export type ApplicationTitleProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "prefix"> & {
    /**
        prefix displayed before the application name, e.g. the company name
    */
    prefix?: string;
    /**
        application logo, <img>, <svg> or react element
    */
    depiction?: ImgDepiction | SvgDepiction | React.ReactNode;
    /**
        is the application title visually displayed or not
    */
    isNotDisplayed?: boolean;
    /**
        if displayed, is the width aligned with displayed sidebar navigation
    */
    isAlignedWithSidebar?: boolean;
    /**
        is the sidebar navigation currently displayed or not
    */
    isApplicationSidebarExpanded: boolean;
    /**
        native attributes for the anchor HTML element (<a>)
    */
    htmlAProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    /**
     * @deprecated Former Carbon `HeaderName` pass-through, has no effect anymore.
     */
    as?: React.ElementType;
    /**
     * @deprecated Former Carbon `HeaderName` pass-through, has no effect anymore.
     */
    element?: React.ElementType;
    /**
     * @deprecated Former Carbon `HeaderName` pass-through, has no effect anymore.
     */
    isSideNavExpanded?: boolean;
};

export const ApplicationTitle = ({
    children,
    className = "",
    prefix = "",
    href,
    depiction,
    isNotDisplayed = false,
    isAlignedWithSidebar = false,
    isApplicationSidebarExpanded,
    htmlAProps,
    // deprecated no-op props, destructured so they never leak onto the DOM
    as: _as,
    element: _element,
    isSideNavExpanded: _isSideNavExpanded,
    ...otherAnchorProps
}: ApplicationTitleProps) => {
    const classApplication = `${eccgui}-application__title`;
    const classNotDisplayed =
        isNotDisplayed || (!isApplicationSidebarExpanded && typeof isNotDisplayed === "undefined")
            ? `${eccgui}-application__title--nodisplay`
            : "";
    const classAlignedSidebar =
        isAlignedWithSidebar || isApplicationSidebarExpanded ? `${eccgui}-application__title--withsidebar` : "";

    return (
        <a
            {...otherAnchorProps}
            {...htmlAProps}
            className={cn(
                // color, text decoration and focus indication are managed in `_header.scss`
                "flex h-full shrink-0 select-none items-center pl-4 pr-8",
                classApplication,
                classAlignedSidebar,
                classNotDisplayed,
                className,
            )}
            href={href}
        >
            <span className={`${eccgui}-application__title--content`}>
                {!!depiction && (
                    <>
                        <span className={`${eccgui}-application__title--depiction`}>
                            {React.isValidElement(depiction) ? (
                                depiction
                            ) : depiction instanceof HTMLElement ? (
                                <>{depiction.outerHTML}</>
                            ) : (
                                depiction
                            )}
                        </span>
                    </>
                )}
                {!!prefix && (
                    <>
                        <span className={cn("font-normal", `${eccgui}-application__title--prefix`)}>{prefix}</span>
                        &nbsp;
                    </>
                )}
                {children}
            </span>
        </a>
    );
};

export default ApplicationTitle;
