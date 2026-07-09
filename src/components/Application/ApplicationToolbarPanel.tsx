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
                // fixed panel below the 56px header at the right viewport edge; 14px padding;
                // animated width open/close (`top-14` = the 56px shell module)
                "fixed bottom-0 right-0 top-14 overflow-hidden bg-sidebar p-3.5 text-sidebar-foreground",
                "transition-[width] duration-[110ms] ease-[cubic-bezier(0.2,0,1,0.9)] will-change-[width]",
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
                className={cn(
                    // fixed backdrop: below the header for the onleave variant, over the whole
                    // viewport (top:0) for the onoutsideclick variant
                    "fixed inset-x-0 bottom-0",
                    onOutsideClick ? "top-0" : "top-14",
                    onLeave && `${eccgui}-application__toolbar__panel-backdrop--onleave`,
                    onOutsideClick && `${eccgui}-application__toolbar__panel-backdrop--onoutsideclick`,
                )}
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
