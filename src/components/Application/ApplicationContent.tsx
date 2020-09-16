import React from "react";
import { Content as CarbonContent } from "carbon-components-react/lib/components/UIShell";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationContent({ children, isApplicationSidebarExpanded = false, ...restProps}: any) {

    const addSidebarMargin = isApplicationSidebarExpanded ? `${eccgui}-application__content--withsidebar` : "";

    return (
        <CarbonContent className={`${eccgui}-application__content ${addSidebarMargin}`} {...restProps}>
            { children }
        </CarbonContent>
    )
}

export default ApplicationContent;
