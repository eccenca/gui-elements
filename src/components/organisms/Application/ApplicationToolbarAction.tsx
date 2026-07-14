import React from "react";

import { cn } from "@/common/utils/cn";
import Tooltip, { TooltipPlacement } from "@/components/atoms/Tooltip/Tooltip";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface ApplicationToolbarActionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    /**
     * Icon (or other depiction) displayed inside the action button.
     */
    children: React.ReactNode;
    /**
     * Accessible label of the action, displayed as tooltip when the action is hovered.
     */
    "aria-label"?: string;
    /**
     * Id of an element that labels the action button.
     */
    "aria-labelledby"?: string;
    /**
     * The action is displayed in an active state, e.g. when the connected toolbar panel is open.
     */
    isActive?: boolean;
    /**
     * Alignment of the tooltip that displays the accessible label.
     */
    tooltipAlignment?: "start" | "center" | "end";
    /**
     * @deprecated Former Carbon `HeaderGlobalAction` pass-through, the tooltip is always
     * displayed in a high contrast style, the property has no effect anymore.
     */
    tooltipHighContrast?: boolean;
    /**
     * @deprecated Former Carbon `HeaderGlobalAction` pass-through, has no effect anymore.
     */
    tooltipDropShadow?: boolean;
}

/**
 * Icon button used inside the `ApplicationToolbar`.
 * The accessible label is displayed as tooltip below the action.
 *
 * The `ref` is forwarded to the rendered `<button>` element.
 */
export const ApplicationToolbarAction = React.forwardRef<HTMLButtonElement, ApplicationToolbarActionProps>(
    (
        {
            children,
            className = "",
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledBy,
            isActive,
            tooltipAlignment,
            tooltipHighContrast: _tooltipHighContrast,
            tooltipDropShadow: _tooltipDropShadow,
            ...otherButtonProps
        },
        ref,
    ) => {
        const button = (
            <button
                {...otherButtonProps}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                className={cn(
                    // `size-14` = the 56px shell module; stock keyboard focus ring
                    "inline-flex size-14 shrink-0 cursor-pointer items-center justify-center border border-transparent bg-transparent outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-border",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                    `${eccgui}-application__toolbar__action`,
                    className,
                )}
                type="button"
                ref={ref}
            >
                {children}
            </button>
        );

        if (!ariaLabel) {
            return button;
        }

        const placement: TooltipPlacement =
            tooltipAlignment === "start" ? "bottom-start" : tooltipAlignment === "end" ? "bottom-end" : "bottom";

        return (
            <Tooltip
                content={ariaLabel}
                placement={placement}
                targetProps={{ className: "inline-flex h-full shrink-0" }}
            >
                {button}
            </Tooltip>
        );
    },
);
ApplicationToolbarAction.displayName = "ApplicationToolbarAction";

export default ApplicationToolbarAction;
