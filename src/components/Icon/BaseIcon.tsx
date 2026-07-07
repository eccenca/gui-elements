import React from "react";

import { IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import Tooltip, { TooltipProps } from "./../Tooltip/Tooltip";
import { IconComponentType } from "./canonicalIconNames";

export interface BaseIconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref" | "name"> {
    /**
     * Icon component that is used. This is a Lucide icon (or any compatible forward-ref SVG
     * component, e.g. one passed to `TestIcon`).
     */
    iconComponent: IconComponentType;
    /**
     * Add tooltip text to icon
     */
    tooltipText?: string;
    /**
     * Accessible title for the icon, rendered as an SVG `<title>` element
     * (formerly provided by the Carbon icon components).
     */
    title?: string;
    /**
     * Intent state of icon.
     * Currently only `success`, `info`, `warning` and `danger` are implemented for icons, even there are more states available.
     */
    intent?: IntentTypes;
    /**
     * Display large icon version.
     */
    large?: boolean;
    /**
     * Display small icon version.
     */
    small?: boolean;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Additonal tooltip properties, e.g. `hoverOpenDelay`.
     */
    tooltipProps?: Partial<Omit<TooltipProps, "content" | "children">>;
}

/**
 * The base icon provides the basic functionality that is necessary to wrap the underlying
 * Lucide icon component.
 */
function BaseIcon({
    iconComponent,
    className = "",
    large = false,
    small = false,
    tooltipText,
    tooltipProps,
    intent,
    tabIndex,
    title,
    strokeWidth = 2,
    ...restProps
}: BaseIconProps) {
    let sizeConfig = { height: 20, width: 20, size: 20 };
    if (small) sizeConfig = { height: 16, width: 16, size: 16 };
    if (large) sizeConfig = { height: 32, width: 32, size: 32 };
    // Lucide icons are forward-ref SVG components that accept a numeric `size` plus
    // `className`/SVG props and understand `strokeWidth`. `strokeWidth={2}` matches the Lucide
    // default and stays balanced at the small sizes used here.
    const IconComponentNamed = iconComponent as React.ElementType;

    const icon = (
        <IconComponentNamed
            {...restProps}
            {...sizeConfig}
            strokeWidth={strokeWidth}
            className={
                `${eccgui}-icon` + (intent ? ` ${eccgui}-intent--${intent}` : "") + (className ? ` ${className}` : "")
            }
            tabIndex={typeof tabIndex !== "undefined" ? tabIndex.toString() : undefined}
        >
            {title ? <title>{title}</title> : undefined}
        </IconComponentNamed>
    );
    return tooltipText ? (
        <Tooltip content={tooltipText} {...tooltipProps}>
            <span>{icon}</span>
        </Tooltip>
    ) : (
        icon
    );
}

export default BaseIcon;
