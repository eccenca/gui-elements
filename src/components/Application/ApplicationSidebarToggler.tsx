import React from "react";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ApplicationSidebarTogglerProps extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "title" | "type"
> {
    /**
     * Accessible label of the toggler button, also used as `title` attribute.
     */
    "aria-label"?: string;
    /**
     * Id of an element that labels the toggler button.
     */
    "aria-labelledby"?: string;
    /**
     * Icon displayed when the sidebar is currently closed.
     */
    renderMenuIcon?: React.JSX.Element;
    /**
     * Icon displayed when the sidebar is currently open.
     */
    renderCloseIcon?: React.JSX.Element;
    /**
     * Is the connected sidebar navigation currently expanded or not.
     */
    isActive?: boolean;
    /**
     * @deprecated The toggler is always displayed as collapsible element, the property has no
     * effect anymore (former Carbon `HeaderMenuButton` pass-through).
     */
    isCollapsible?: boolean;
}

export const ApplicationSidebarToggler = ({
    className = "",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    renderMenuIcon,
    renderCloseIcon,
    isActive,
    isCollapsible: _isCollapsible,
    ...otherButtonProps
}: ApplicationSidebarTogglerProps) => {
    return (
        <button
            {...otherButtonProps}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={cn(
                // focus indication is managed in `_sidebar.scss`
                "inline-flex size-16 shrink-0 cursor-pointer items-center justify-center border border-transparent bg-transparent transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-border",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                `${eccgui}-application__menu__toggler`,
                className,
            )}
            title={ariaLabel}
            type="button"
        >
            {isActive ? (renderCloseIcon ?? <CloseIcon size={20} />) : (renderMenuIcon ?? <MenuIcon size={20} />)}
        </button>
    );
};

export default ApplicationSidebarToggler;
