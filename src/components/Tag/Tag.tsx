import React from "react";
import { Tag as BlueprintTag, TagProps as BlueprintTagProps } from "@blueprintjs/core";
import Color from "color";

import { intentClassName, IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { ValidIconName } from "../Icon/canonicalIconNames";
import Icon, { IconProps } from "../Icon/Icon";
import { TestIconProps } from "../Icon/TestIcon";

import decideContrastColorValue from "./../../common/utils/colorDecideContrastvalue";

export interface TagProps
    extends Omit<
        BlueprintTagProps,
        // currently not supported
        "active" | "fill" | "icon" | "intent" | "large" | "multiline" | "rightIcon"
    > {
    // own properties

    /**
     * Sets the background color of a tag, depends on the `Color` object provided by the
     * [npm color module](https://www.npmjs.com/export package/color) v3. You can use it with
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
    /**
     * display tag in a large version
     */
    large?: boolean;
    /**
     * Meaning of the tag.
     */
    intent?: IntentTypes;
    /**
     * Icon displayed left from the tag label.
     */
    icon?: ValidIconName | React.ReactElement<IconProps> | React.ReactElement<TestIconProps>;
}

function Tag({
    children,
    className = "",
    intent,
    icon,
    emphasis = "normal",
    minimal = true,
    small = false,
    large = false,
    backgroundColor,
    ...otherProps
}: TagProps) {
    otherProps["interactive"] = otherProps.interactive ?? !!otherProps.onClick ? true : false;
    if (backgroundColor) {
        const additionalStyles = otherProps.style ?? {};
        let color = Color("#ffffff");
        try {
            color = Color(backgroundColor);
        } catch (ex) {
            // eslint-disable-next-line no-console
            console.warn("Received invalid background color for tag: " + backgroundColor);
        }

        otherProps["style"] = {
            ...additionalStyles,
            ...{
                backgroundColor: color.rgb().toString(),
                color: decideContrastColorValue({ testColor: color }),
            },
        };
    }
    const leftIcon = !!icon && typeof icon === "string" ? <Icon name={icon} /> : icon;
    return (
        <BlueprintTag
            {...otherProps}
            className={
                `${eccgui}-tag__item ${eccgui}-tag--${emphasis}emphasis` +
                (intent ? ` ${intentClassName(intent)}` : "") +
                (small ? ` ${eccgui}-tag--small` : "") +
                (large ? ` ${eccgui}-tag--large` : "") +
                (className ? " " + className : "")
            }
            minimal={minimal}
            icon={leftIcon ? React.cloneElement(leftIcon, { small: !large }) : undefined}
        >
            {children}
        </BlueprintTag>
    );
}

export default Tag;
