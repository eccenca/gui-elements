import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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
        addSidebarMargin = `${eccgui}-application__content--withsidebar`;
    }
    if (isApplicationSidebarRail) {
        addSidebarMargin = `${eccgui}-application__content--railsidebar`;
    }

    return (
        <main
            // dimension, spacing and sidebar margins are managed in `_content.scss`
            className={cn(`${eccgui}-application__content`, addSidebarMargin, className)}
            {...otherUnknownProps}
            {...htmlMainProps}
        >
            {children}
        </main>
    );
};

export default ApplicationContent;
