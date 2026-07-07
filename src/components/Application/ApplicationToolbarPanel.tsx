import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ApplicationToolbarPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Is the panel currently displayed (opened) or not.
     */
    expanded?: boolean;
    /**
     * Event handler getting called when the pointer device leaves the area of the panel menu.
     * Could be used to close it automatically.
     */
    onLeave?: () => void;
    /**
     * Event handler getting called when the the user clicks outside of the panel menu area.
     */
    onOutsideClick?: () => void;
    /**
     * @deprecated Former Carbon `HeaderPanel` pass-through, has no effect anymore.
     * The state is fully controlled via the `expanded` property, use `onLeave` or
     * `onOutsideClick` to close the panel automatically.
     */
    addFocusListeners?: boolean;
    /**
     * @deprecated Former Carbon `HeaderPanel` pass-through, has no effect anymore.
     */
    onHeaderPanelFocus?: () => void;
    /**
     * @deprecated Former Carbon `HeaderPanel` pass-through, has no effect anymore.
     */
    href?: string;
}

/**
 * Panel attached to the `ApplicationToolbar`, displayed below the application header at the
 * right side of the viewport. It is used for menus connected to toolbar actions.
 */
export const ApplicationToolbarPanel = ({
    children,
    className = "",
    expanded = false,
    onLeave,
    onOutsideClick,
    // deprecated no-op props, destructured so they never leak onto the DOM
    addFocusListeners: _addFocusListeners,
    onHeaderPanelFocus: _onHeaderPanelFocus,
    href: _href,
    ...otherDivProps
}: ApplicationToolbarPanelProps) => {
    const panel = (
        <div
            {...otherDivProps}
            className={cn(
                // spacing and open/close transition are managed in `_toolbar.scss`
                "fixed bottom-0 right-0 top-16 overflow-hidden bg-sidebar text-sidebar-foreground",
                expanded ? "w-64 overflow-y-auto border-x border-sidebar-border" : "w-0",
                `${eccgui}-application__toolbar__panel`,
                className,
            )}
            data-expanded={expanded ? "true" : "false"}
        >
            {children}
        </div>
    );

    return onLeave || onOutsideClick ? (
        <>
            <div
                className={
                    (onLeave ? `${eccgui}-application__toolbar__panel-backdrop--onleave` : "") +
                    (onOutsideClick ? `${eccgui}-application__toolbar__panel-backdrop--onoutsideclick` : "")
                }
                onClick={onOutsideClick}
                onPointerEnter={onLeave}
            />
            {panel}
        </>
    ) : (
        panel
    );
};

export default ApplicationToolbarPanel;
