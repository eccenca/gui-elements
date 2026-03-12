import React from "react";
import { Tag as BlueprintTag, TagProps as BlueprintTagProps } from "@blueprintjs/core";
import Color from "color";

import { intentClassName, IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { ValidIconName } from "../Icon/canonicalIconNames";
import Icon, { IconProps } from "../Icon/Icon";
import { TestIconProps } from "../Icon/TestIcon";

import decideContrastColorValue from "./../../common/utils/colorDecideContrastvalue";

const WHITE = '#FFFFFF';
const BLACK = '#000000';

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
     * When `outlined` is true, it becomes the border. When `outlined` is false, it behaves like expected (fills the background).
     */
    backgroundColor?: Color | string;

    /**
     * Display tag with outlined style — transparent background with only a colored border.
     * Works with `backgroundColor`, `intent`, or default colors for the border styling.
     */
    outlined?: boolean;

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
    color,
    outlined = false,
    ...otherProps
}: TagProps) {
    otherProps["interactive"] = otherProps.interactive ?? !!otherProps.onClick;

    const additionalStyles = otherProps.style ?? {};

    if (outlined) {
        let colorObj = Color(BLACK);
        try {
            colorObj = Color(backgroundColor);
        } catch (ex: unknown) {
            // eslint-disable-next-line no-console
            console.warn("Received invalid background color for tag: " + backgroundColor);
        }
        otherProps["style"] = {
            ...additionalStyles,
            borderColor: colorObj.rgb().toString(),
        };
    } else if (!outlined && backgroundColor) {
        let backgroundObj = Color(WHITE);

        try {
            backgroundObj = Color(backgroundColor);
        } catch {
            // eslint-disable-next-line no-console
            console.warn("Received invalid background color for tag: " + backgroundColor);
        }

        let colorObj = Color(decideContrastColorValue({ testColor: backgroundObj }));
        if (color) {
            try {
                colorObj = Color(color);
            } catch {
                // eslint-disable-next-line no-console
                console.warn("Received invalid color for tag: " + color);
            }
        }

        otherProps["style"] = {
            ...additionalStyles,
            backgroundColor: backgroundObj.rgb().toString(),
            color: colorObj.rgb().toString(),
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
                (outlined ? ` ${eccgui}-tag--outlined` : "") +
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
