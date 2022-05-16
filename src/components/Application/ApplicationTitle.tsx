import React from "react";
import { HeaderName as CarbonHeaderName } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

type SvgDepiction = HTMLElement & SVGElement;
type ImgDepiction = HTMLElement & HTMLImageElement;

interface IApplicationTitleProps {
    // original properties from Carbon
    children: React.ReactNode;
    /**
        addional class name
    */
    className?: string;
    /**
        prefix the application name by extra string, e.g. company name
    */
    prefix?: string;
    /**
        home link
    */
    href?: string;

    // our extensions
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
}

function ApplicationTitle({
    children,
    className = "",
    prefix = "",
    href,
    depiction,
    isNotDisplayed = false,
    isAlignedWithSidebar=false,
    isApplicationSidebarExpanded,
    htmlAProps,
    ...otherPropsShouldOnlyBeUsedForDataAttributes
}: IApplicationTitleProps) {

    const classApplication = `${eccgui}-application__title`;
    const classNotDisplayed = isNotDisplayed || (!isApplicationSidebarExpanded && typeof isNotDisplayed === "undefined") ? "bx--visually-hidden" : "";
    const classAlignedSidebar = isAlignedWithSidebar || isApplicationSidebarExpanded ? `${eccgui}-application__title--withsidebar` : "";

    return (
        <CarbonHeaderName
            {...otherPropsShouldOnlyBeUsedForDataAttributes}
            {...htmlAProps}
            className={`${classApplication} ${classAlignedSidebar} ${classNotDisplayed} ${className}`}
            href={href}
            prefix=""
        >
            <span className={`${eccgui}-application__title--content`}>
                {!!depiction && (
                        <>
                            <span className={`${eccgui}-application__title--depiction`}>{depiction}</span>
                        </>
                )}
                {!!prefix && (
                        <>
                            <span className="bx--header__name--prefix">{prefix}</span>
                            &nbsp;
                        </>
                )}
                { children }
            </span>
        </CarbonHeaderName>
    )
}

export default ApplicationTitle;
