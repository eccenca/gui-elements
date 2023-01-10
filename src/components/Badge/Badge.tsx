import React from "react";
import Tag, { TagProps } from "../Tag/Tag";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /**
     * The badge only accepts numbers, text and ions as valid content.
     */
    children: string | number;
    /**
     * Position relative to the parent element where the badge is displayed.
     * `top-right` and `bottom-right` relate to the closest parent element that uses a `relative` or similar positioning.
     */
    position?: "inline" | "top-right" | "bottom-right";
    /**
     * Size of the badge.
     */
    size?: "small" | "medium" | "large"
    /**
     * Maximum characters used by the badge.
     * Text will be ellipsed, a number is displayed for example a 99+.
     * `maxLength` need to be at least 2, otherwise it's ignored.
     * For text it is only a raw measurement, not always an exact character count.
     */
    maxLength?: number;
    /**
     * Internally the `<Tag/>` element is used for the badge.
     * Forward other options to the tag.
     * This may overwrite properties set by the badge, use it with care.
     */
    tagProps?: TagProps;
}

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
  tagProps,
  ...spanProps
}: BadgeProps) {
    let badgeContent = children;
    // shorten number values
    // for maxLength=3 display 99+ instead of 1023.
    if (
        typeof children === "number" &&
        maxLength &&
        maxLength > 1 &&
        children >= Math.pow(10, maxLength-1)
    ) {
        badgeContent = `${Math.pow(10, maxLength-1) - 1}+`
    }
    return (
        <span
            className={
                `${eccgui}-badge ${eccgui}-badge--${position}`
            }
            {...spanProps}
        >
            <Tag
                className={`${eccgui}-badge__tag`}
                round
                small={size === "small"}
                large={size === "large"}
                emphasis="stronger"
                style={(typeof children === "string" && maxLength && maxLength > 1) ? {maxWidth: `calc((${maxLength-1}em + ${maxLength-1}ch)/2)`} : {}}
                {...tagProps}
            >
                {badgeContent}
            </Tag>
        </span>
    );
}
