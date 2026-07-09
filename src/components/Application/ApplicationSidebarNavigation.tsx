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
                // On the same z-layer as the header (8000, one below modals). `top-14`/`w-72`/`w-14`
                // mirror the 56px shell module. Horizontal padding centers the 30px menu items inside
                // the 56px rail (`(56-30)/2 = 13px`). The `.eccgui-structure__title-subsection` hide in
                // the collapsed rail stays in the KEEP block of `_sidebar.scss` (its `__` classname
                // collides with Tailwind's `_`=space arbitrary-variant escaping).
                "fixed bottom-0 left-0 top-14 z-[8000] flex max-w-72 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar px-[13px] py-3.5 text-sidebar-foreground",
                isRail
                    ? // reduced rail, enlarged to the full 288px on hover (delayed, matching the former transition)
                      "w-14 hover:w-72 hover:transition-[width] hover:delay-[750ms] hover:duration-[100ms] hover:ease-in"
                    : expanded
                      ? "w-72"
                      : "w-72 -translate-x-full", // moved out of the canvas
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
