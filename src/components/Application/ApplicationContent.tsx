import React from "react";
import { Content as CarbonContent } from "carbon-components-react/lib/components/UIShell";
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
    /*
        TODO: type definitions do not include data attributes because of their infinite number of possible names, so we
        need to solve this by filtering out all other props, or create a stack of allowed data attributes or using
        a combined process of dynamic keys and template mappings in typescript
    */
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
