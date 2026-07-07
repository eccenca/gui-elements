import React from "react";

import { IntentTypes } from "../../common/Intent";
import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { IconProps } from "../Icon/Icon";
import { TestIconProps } from "../Icon/TestIcon";
import Tag, { TagProps } from "../Tag/Tag";

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
    /**
     * The badge only accepts numbers, text and ions as valid content.
     */
    children: string | number | React.ReactElement<IconProps> | React.ReactElement<TestIconProps>;
    /**
     * Position relative to the parent element where the badge is displayed.
     * `top-right` and `bottom-right` relate to the closest parent element that uses a `relative` or similar positioning.
     */
    position?: "inline" | "top-right" | "bottom-right";
    /**
     * Size of the badge.
     */
    size?: "small" | "medium" | "large";
    /**
     * Maximum characters used by the badge.
     * Text will be ellipsed, a number is displayed for example a 99+.
     * `maxLength` need to be at least 2, otherwise it's ignored.
     * For text it is only a raw measurement, not always an exact character count.
     */
    maxLength?: number;
    /**
     * Meaning of the badge.
     */
    intent?: IntentTypes;
    /**
     * Internally the `<Tag/>` element is used for the badge.
     * Forward other options to the tag.
     * This may overwrite properties set by the badge, use it with care.
     */
    tagProps?: TagProps;
}

/** Utilities that position the badge wrapper relative to its parent. */
const positionClasses: Record<NonNullable<BadgeProps["position"]>, string> = {
    inline: "inline-flex align-middle",
    "top-right": "absolute top-0 right-0",
    "bottom-right": "absolute right-0 bottom-0",
};

/** Utilities that nudge the inner tag so it overlaps the requested corner. */
const tagOffsetClasses: Record<NonNullable<BadgeProps["position"]>, string> = {
    inline: "",
    "top-right": "-translate-y-1/2 translate-x-1/2",
    "bottom-right": "translate-y-1/2 translate-x-1/2",
};

/**
 * Display a badge element to add more context to another element.
 * It can display icons, text and numbers.
 */
export function Badge({
    children,
    className = "",
    position = "inline",
    size = "medium",
    maxLength,
    intent,
    tagProps,
    ...spanProps
}: BadgeProps) {
    let badgeContent = children;
    // shorten number values
    // for maxLength=3 display 99+ instead of 1023.
    if (typeof children === "number" && maxLength && maxLength > 1 && children >= Math.pow(10, maxLength - 1)) {
        badgeContent = `${Math.pow(10, maxLength - 1) - 1}+`;
    }
    const isIcon = typeof children === "object";
    if (isIcon) {
        badgeContent = "";
    }
    return (
        <span
            className={cn(
                `${eccgui}-badge`,
                `${eccgui}-badge--${position}`,
                positionClasses[position],
                isIcon ? `${eccgui}-badge--icon` : "",
                className
            )}
            {...spanProps}
        >
            <Tag
                className={cn(`${eccgui}-badge__tag`, tagOffsetClasses[position], isIcon ? "min-h-0 min-w-0 p-0" : "")}
                round
                small={size === "small"}
                large={size === "large"}
                emphasis={!intent ? "stronger" : undefined}
                intent={intent}
                minimal={intent ? false : true}
                icon={typeof children === "object" ? children : undefined}
                style={
                    typeof children === "string" && maxLength && maxLength > 1
                        ? { maxWidth: `calc((${maxLength - 1}em + ${maxLength - 1}ch)/2)` }
                        : {}
                }
                {...tagProps}
            >
                {badgeContent}
            </Tag>
        </span>
    );
}

export default Badge;
