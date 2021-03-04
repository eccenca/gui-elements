import React from "react";
import { HeaderName as CarbonHeaderName } from "carbon-components-react/lib/components/UIShell";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationTitle({
    children,
    className,
    prefix,
    isNotDisplayed=false,
    isAlignedWithSidebar=false,
    ...restProps
}: any) {

    const classApplication = `${eccgui}-application__title`;
    const classNotDisplayed = isNotDisplayed ? "bx--visually-hidden" : "";
    const classAlignedSidebar = isAlignedWithSidebar ? `${eccgui}-application__title--withsidebar` : "";

    return (
        <CarbonHeaderName className={`${classApplication} ${classAlignedSidebar} ${classNotDisplayed}`} {...restProps} prefix="">
            <span className={`${eccgui}-application__title--content`}>
                {
                    prefix ? (
                        <span className="bx--header__name--prefix">{prefix}&nbsp;</span>
                    ) : (
                        <></>
                    )
                }
                { children }
            </span>
        </CarbonHeaderName>
    )
}

export default ApplicationTitle;
