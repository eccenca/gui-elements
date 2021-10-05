import React from "react";
import { HeaderName as CarbonHeaderName } from "carbon-components-react/lib/components/UIShell";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

type depSvg = HTMLElement & SVGElement;
type depImg = HTMLElement & HTMLImageElement;

interface IApplicationTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
    className?: string;
    prefix?: string;
    depiction?: depImg | depSvg;
    isNotDisplayed?: boolean;
    isAlignedWithSidebar?: boolean;
    isApplicationSidebarExpanded: boolean;
    href?: string;
}

function ApplicationTitle({
    children,
    className = "",
    prefix,
    depiction,
    isNotDisplayed,
    isAlignedWithSidebar=false,
    isApplicationSidebarExpanded,
    ...otherProps
}: IApplicationTitleProps) {

    const classApplication = `${eccgui}-application__title`;
    const classNotDisplayed = isNotDisplayed || (!isApplicationSidebarExpanded && typeof isNotDisplayed === "undefined") ? "bx--visually-hidden" : "";
    const classAlignedSidebar = isAlignedWithSidebar || isApplicationSidebarExpanded ? `${eccgui}-application__title--withsidebar` : "";

    return (
        <CarbonHeaderName
            className={`${classApplication} ${classAlignedSidebar} ${classNotDisplayed} ${className}`}
            {...otherProps}
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
