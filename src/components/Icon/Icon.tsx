import React from "react";
import { IconProps as CarbonIconProps } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { IntenTypes } from "../../common/Intent";
import Tooltip, { TooltipProps } from "./../Tooltip/Tooltip";
import canonicalIconNames from "./canonicalIconNames.json";

interface IconProps extends Omit<CarbonIconProps, "icon"> {
    // The CSS class name.
    className?: string,
    // Canonical icon name
    name: string,
    // Display large icon version
    large?: boolean,
    // Display small icon version
    small?: boolean,
    // Add tooltip text to icon
    tooltipText?: string,
    // Time after tooltip text is viible when icon is hovered/focuses
    tooltipOpenDelay?: number,
    // Other tooltip properties
    tooltipProperties?: TooltipProps,
    // Intent state of icon (currently only success, info, warning and danger are implemented in style rules)
    intent?: IntenTypes,
}

/** Returns the first icon name that exists or the fallback icon name. */
export const findExistingIconName = (iconName: string | string[],
                                     iconNameFallback: string = "Undefined"): string => {
    let iconNameStack = typeof iconName === "string" ? [iconName] : iconName;
    let existingIconName = iconNameFallback;
    while (existingIconName === iconNameFallback && iconNameStack.length > 0) {
        let nameTest = iconNameStack.shift();
        if (nameTest && typeof canonicalIconNames[nameTest] !== "undefined") {
            existingIconName = nameTest
        }
    }
    return existingIconName
}

function Icon({
    className = "",
    name = "undefined",
    large = false,
    small = false,
    tooltipText,
    tooltipOpenDelay,
    tooltipProperties,
    intent,
    ...restProps
}: any) {
    let sizeConfig = { height: 20, width: 20 };
    if (small) sizeConfig = { height: 16, width: 16 };
    if (large) sizeConfig = { height: 32, width: 32 };
    const foundIconName = findExistingIconName(name)
    const iconNameToUse = canonicalIconNames[foundIconName]
    const iconImportName = `${iconNameToUse}${sizeConfig.width}`
    const CarbonIcon = require("@carbon/icons-react")[iconImportName];

    const icon = (
        <CarbonIcon
            {...restProps}
            {...sizeConfig}
            className={
                `${eccgui}-icon ` +
                (intent ? `${eccgui}-intent-${intent} ` : "") +
                className
            }
        />
    );
    return tooltipText ? (
        <Tooltip content={tooltipText} hoverOpenDelay={tooltipOpenDelay} {...tooltipProperties}>
            <span>{icon}</span>
        </Tooltip>
    ) : (
        icon
    );
}

export default Icon;
