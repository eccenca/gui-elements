import React from "react";
import { Content as CarbonContent } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface IApplicationContentProps {
    // original properties from Carbon
    children: React.ReactNode;
    /**
        addional class name
    */
    className?: string;

    // our extensions
    /**
        is the sidebar navigation currently displayed or not
    */
    isApplicationSidebarExpanded?: boolean;
    /**
        is the rail version of the sidebar used or not
    */
    isApplicationSidebarRail?: boolean;
    /**
        native attributes for the <main> HTML element
    */
    htmlMainProps?: React.HTMLAttributes<HTMLElement>;
}

function ApplicationContent({
    children,
    isApplicationSidebarExpanded = false,
    isApplicationSidebarRail = false,
    htmlMainProps,
    ...otherPropsShouldOnlyBeUsedForDataAttributes
}: IApplicationContentProps) {

    let addSidebarMargin = "";
    if (isApplicationSidebarExpanded) { addSidebarMargin = `${eccgui}-application__content--withsidebar`; }
    if (isApplicationSidebarRail) { addSidebarMargin = `${eccgui}-application__content--railsidebar`; }

    return (
        <CarbonContent
            {...otherPropsShouldOnlyBeUsedForDataAttributes}
            {...htmlMainProps}
            className={`${eccgui}-application__content ${addSidebarMargin}`}
            tagName={"main"}
        >
            { children }
        </CarbonContent>
    )
}

export default ApplicationContent;
