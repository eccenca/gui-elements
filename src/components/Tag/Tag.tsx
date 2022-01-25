import React from 'react';
import {
    Tag as BlueprintTag,
    TagProps as BlueprintTagProps
} from "@blueprintjs/core";
import Color from "color";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface TagProps extends Omit<
    BlueprintTagProps,
    // currently not supported
    "active" |
    "fill" |
    "large" |
    "multiline" |
    "intent" |
    "rightIcon" |
    "round"
> {
    // own properties

    /**
     * Sets the background color of a tag, depends on the `Color` object provided by the
     * [npm color module](https://www.npmjs.com/package/color) v3. You can use it with
     * all allowed [CSS color values](https://developer.mozilla.org/de/docs/Web/CSS/color_value).
     *
     * The front color is set automatically, so the tag label is always readable.
     */
    backgroundColor?: Color | string;

    /**
     * visual appearance and "thickness" of the tag
     */
    emphasis?: "stronger" | "strong" | "normal" | "weak" | "weaker";
    /**
     * display tag in a small version
     */
    small?: boolean;

    // deprecated

    /**
     * **deprecated**, use `minimal=false` plus `emphasis="stronger"`
     */
    emphasized?: never;
}

function Tag({
    children,
    className = '',
    emphasis = "normal",
    minimal = true,
    small = false,
    backgroundColor,
    ...otherProps
}: TagProps) {
    otherProps['interactive'] = otherProps.interactive ?? !!otherProps.onClick ? true : false;
    if (!!backgroundColor) {
        const additionalStyles = otherProps.style ?? {};
        const color = Color(backgroundColor);
        otherProps['style'] = {
            ...additionalStyles,
            ...{
                backgroundColor: color.rgb().toString(),
                color: color.isLight() ? "#000" : "#fff",
            }
        }
    }
    return (
        <BlueprintTag
            {...otherProps}
            className={
                `${eccgui}-tag__item ${eccgui}-tag--${emphasis}emphasis` +
                (small ? ` ${eccgui}-tag--small` : '') +
                (className ? ' ' + className : '')
            }
            minimal={minimal}
        >
            {children}
        </BlueprintTag>
    );
};

export default Tag;
