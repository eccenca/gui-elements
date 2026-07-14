import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface ApplicationContentProps {
    /**
        Literally the application content displayed in the main area
    */
    children: React.ReactNode;
    /**
        addional class name
    */
    className?: string;
    /**
        is the sidebar navigation currently displayed or not
    */
    isApplicationSidebarExpanded?: boolean;
    /**
        is the rail version of the sidebar used or not
    */
    isApplicationSidebarRail?: boolean;
    /**
        native attributes for the <main> HTML element, except `className`
    */
    htmlMainProps?: Omit<React.HTMLAttributes<HTMLElement>, "className">;
}

export const ApplicationContent = ({
    children,
    className = "",
    isApplicationSidebarExpanded = false,
    isApplicationSidebarRail = false,
    htmlMainProps,
    ...otherUnknownProps
}: ApplicationContentProps) => {
    let addSidebarMargin = "";
    if (isApplicationSidebarExpanded) {
        // clear the 288px expanded sidebar
        addSidebarMargin = cn(`${eccgui}-application__content--withsidebar`, "ml-72");
    }
    if (isApplicationSidebarRail) {
        // clear the 56px sidebar rail
        addSidebarMargin = cn(`${eccgui}-application__content--railsidebar`, "ml-14");
    }

    return (
        <main
            // 100vh min-height + 14px block padding; `transform-none` keeps fixed-positioned children
            // relative to the viewport; the sidebar margin animates. The header-clearance top padding +
            // reduced min-height (content rendered under a fixed header) and the fullheight grid-row
            // offset stay in the KEEP block of `_content.scss` (sibling/descendant selectors with
            // `__` classnames and no prop signal available here).
            className={cn(
                `${eccgui}-application__content`,
                "min-h-screen transform-none p-3.5 transition-[margin-left] will-change-[margin-left]",
                addSidebarMargin,
                className,
            )}
            {...otherUnknownProps}
            {...htmlMainProps}
        >
            {children}
        </main>
    );
};

export default ApplicationContent;
