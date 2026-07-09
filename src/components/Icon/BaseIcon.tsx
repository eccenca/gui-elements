import React from "react";

import { IntentTypes } from "../../common/Intent";
import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import Tooltip, { TooltipProps } from "./../Tooltip/Tooltip";
import { IconComponentType } from "./canonicalIconNames";

/**
 * Icon text-color per intent (former `.eccgui-intent--*` rules in `icon.scss`). "none"/"neutral"
 * intentionally have no entry - an icon without a mapped intent never had color forced onto it.
 */
const intentTextClass: Partial<Record<IntentTypes, string>> = {
    primary: "text-primary",
    // historically a distinct "accent" brand color; the current token set only defines a single
    // brand blue (`--primary`), so `accent` resolves to the same utility (mirrors Button/Spinner).
    accent: "text-primary",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
};

/**
 * `size-*` utility matching each physical icon size (`sizeConfig` below). Keeps the icon box
 * expressed as a real, greppable Tailwind class (not just bare SVG `width`/`height` attributes).
 */
const sizeUtilityClass = {
    small: "size-4",
    default: "size-5",
    large: "size-8",
} as const;

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
    let sizeClass: string = sizeUtilityClass.default;
    if (small) {
        sizeConfig = { height: 16, width: 16, size: 16 };
        sizeClass = sizeUtilityClass.small;
    }
    if (large) {
        sizeConfig = { height: 32, width: 32, size: 32 };
        sizeClass = sizeUtilityClass.large;
    }
    // Lucide icons are forward-ref SVG components that accept a numeric `size` plus
    // `className`/SVG props and understand `strokeWidth`. `strokeWidth={2}` matches the Lucide
    // default and stays balanced at the small sizes used here.
    const IconComponentNamed = iconComponent as React.ElementType;

    const icon = (
        <IconComponentNamed
            {...restProps}
            {...sizeConfig}
            strokeWidth={strokeWidth}
            className={cn(
                `${eccgui}-icon`,
                intent && `${eccgui}-intent--${intent}`,
                // former `svg.eccgui-icon` rules (icon.scss): never grow/shrink in a flex layout,
                // never get clamped by an ancestor `max-width`, align like inline text, and paint
                // with the current text color unless the glyph ships its own explicit `fill`
                // (Lucide's filled variants already set `fill="currentColor"`/`fill="none"` themselves).
                "grow-0 shrink-0 max-w-none align-text-bottom [&:not([fill])]:fill-current",
                sizeClass,
                intent && intentTextClass[intent],
                className,
            )}
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
