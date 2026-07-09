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
                // `size-14` = the 56px shell module; stock keyboard focus ring
                "inline-flex size-14 shrink-0 cursor-pointer items-center justify-center border border-transparent bg-transparent outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-border",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                `${eccgui}-application__menu__toggler`,
                className,
            )}
            title={ariaLabel}
            type="button"
        >
            {isActive ? (
                renderCloseIcon ?? <CloseIcon size={20} className="size-5" />
            ) : (
                renderMenuIcon ?? <MenuIcon size={20} className="size-5" />
            )}
        </button>
    );
};

export default ApplicationSidebarToggler;
