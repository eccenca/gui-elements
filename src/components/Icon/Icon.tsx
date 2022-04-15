import React from "react";
import { IconProps as CarbonIconProps } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { IntentTypes } from "../../common/Intent";
import Tooltip, { TooltipProps } from "./../Tooltip/Tooltip";
import canonicalIcons, {IconSized, ValidIconName} from "./canonicalIconNames"

export interface IconProps extends Omit<CarbonIconProps, "icon" | "description" | "name"> {
    // The CSS class name.
    className?: string,
    // Canonical icon name
    name: ValidIconName | string[],
    // description for SVG as accessibility fallback
    description?: string,
    // Display large icon version
    large?: boolean,
    // Display small icon version
    small?: boolean,
    // Add tooltip text to icon
    tooltipText?: string,
    // Time after tooltip text is visible when icon is hovered/focuses
    tooltipOpenDelay?: number,
    // Other tooltip properties
    tooltipProperties?: Partial<Omit<TooltipProps, "content" | "children">>,
    // Intent state of icon (currently only success, info, warning and danger are implemented in style rules)
    intent?: IntentTypes
}

/** Returns the first icon that exists or the fallback icon. */
const findExistingIcon = (iconName: ValidIconName | string[],
                          fallbackItem: IconSized = canonicalIcons["Undefined"]): IconSized => {
    if (typeof iconName === "string") {
        return canonicalIcons[iconName] ?? fallbackItem
    } else {
        return canonicalIcons[findExistingIconName(iconName)]
    }
}

/** Returns the first icon name that exists or the fallback icon name. */
export const findExistingIconName = (iconNames: string[],
                                     fallbackIconName: ValidIconName = "Undefined"): ValidIconName => {
    let foundIconName: string = fallbackIconName;
    const iconNameStack = [...iconNames]
    while (foundIconName === fallbackIconName && iconNameStack.length > 0) {
        let iconNameToTest = iconNameStack.shift();
        if (iconNameToTest && canonicalIcons[iconNameToTest] != null) {
            foundIconName = iconNameToTest
        }
    }
    return foundIconName as ValidIconName
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
}: IconProps) {
    let sizeConfig = { height: 20, width: 20 };
    if (small) sizeConfig = { height: 16, width: 16 };
    if (large) sizeConfig = { height: 32, width: 32 };
    const carbonIcon = findExistingIcon(name)
    let CarbonIconSized = carbonIcon.normal
    if(small) CarbonIconSized = carbonIcon.small
    if(large) CarbonIconSized = carbonIcon.large

    if (!!tooltipText && !restProps.description) {
        restProps['description'] = tooltipText;
    }

    const icon = (
        <CarbonIconSized
            {...restProps}
            {...sizeConfig}
            className={
                `${eccgui}-icon ` +
                (intent ? `${eccgui}-intent--${intent} ` : "") +
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
