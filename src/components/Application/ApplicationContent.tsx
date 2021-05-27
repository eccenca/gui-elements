import React from "react";
import { Content as CarbonContent } from "carbon-components-react/lib/components/UIShell";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface IApplicationContentProps extends React.HTMLAttributes<HTMLElement> {
    isApplicationSidebarExpanded?: boolean;
    isApplicationSidebarRail?: boolean;
}

function ApplicationContent({
    children,
    isApplicationSidebarExpanded = false,
    isApplicationSidebarRail = false,
    ...otherProps
}: IApplicationContentProps) {

    let addSidebarMargin = "";
    if (isApplicationSidebarExpanded) { addSidebarMargin = `${eccgui}-application__content--withsidebar`; }
    if (isApplicationSidebarRail) { addSidebarMargin = `${eccgui}-application__content--railsidebar`; }

    return (
        <CarbonContent className={`${eccgui}-application__content ${addSidebarMargin}`} {...otherProps}>
            { children }
        </CarbonContent>
    )
}

export default ApplicationContent;
