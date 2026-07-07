import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ApplicationSidebarNavigationProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
    /**
     * Is the sidebar navigation currently expanded to its full width or not.
     */
    expanded?: boolean;
    /**
     * Display the not expanded sidebar as small rail with always visible menu icons.
     * The rail is temporarily enlarged when hovered by the pointer.
     */
    isRail?: boolean;
    /**
     * @deprecated Former Carbon `SideNav` pass-through, has no effect anymore.
     * The state is fully controlled via the `expanded` property.
     */
    onToggle?: (event: unknown, value: boolean) => void;
    /**
     * @deprecated Former Carbon `SideNav` pass-through, has no effect anymore.
     */
    href?: string;
    /**
     * @deprecated Former Carbon `SideNav` pass-through, has no effect anymore.
     */
    addFocusListeners?: boolean;
    /**
     * @deprecated Former Carbon `SideNav` pass-through, has no effect anymore.
     */
    addMouseListeners?: boolean;
    /**
     * @deprecated Former Carbon `SideNav` pass-through, has no effect anymore.
     * An overlay is never displayed.
     */
    onOverlayClick?: React.MouseEventHandler<HTMLDivElement>;
    /**
     * @deprecated Former Carbon `SideNav` pass-through, has no effect anymore.
     */
    onSideNavBlur?: () => void;
    /**
     * @deprecated Former Carbon `SideNav` pass-through, has no effect anymore.
     */
    enterDelayMs?: number;
}

export const ApplicationSidebarNavigation = ({
    children,
    className = "",
    expanded = false,
    isRail = false,
    // deprecated no-op props, destructured so they never leak onto the DOM
    onToggle: _onToggle,
    href: _href,
    addFocusListeners: _addFocusListeners,
    addMouseListeners: _addMouseListeners,
    onOverlayClick: _onOverlayClick,
    onSideNavBlur: _onSideNavBlur,
    enterDelayMs: _enterDelayMs,
    ...otherNavProps
}: ApplicationSidebarNavigationProps) => {
    return (
        <nav
            tabIndex={-1}
            className={cn(
                // z-index, spacing, transitions and the rail hover expansion are managed in `_sidebar.scss`
                "fixed bottom-0 left-0 top-16 flex max-w-80 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
                isRail
                    ? "w-16" // reduced rail, enlarged on hover via `_sidebar.scss`
                    : expanded
                      ? "w-80"
                      : "w-80 -translate-x-full", // moved out of the canvas
                `${eccgui}-application__menu__sidebar`,
                isRail && `${eccgui}-application__menu__sidebar--rail`,
                expanded && `${eccgui}-application__menu__sidebar--expanded`,
                className,
            )}
            {...otherNavProps}
            aria-label={"sidebar"}
            data-expanded={expanded ? "true" : "false"}
        >
            {children}
        </nav>
    );
};

export default ApplicationSidebarNavigation;
