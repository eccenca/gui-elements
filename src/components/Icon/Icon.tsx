import React from "react";
import { IconProps as CarbonIconProps } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { IntentTypes } from "../../common/Intent";
import Tooltip, { TooltipProps } from "./../Tooltip/Tooltip";
import canonicalIcons, {CarbonIconType, ValidIconName} from "./canonicalIconNames"

export interface IconProps extends Omit<CarbonIconProps, "icon" | "description" | "name"> {
    /**
     * Canonical icon name, or an array of strings.
     * In case of the array the first valid icon name is used.
     */
    name: ValidIconName | string[],
    /**
     * Add tooltip text to icon
     */
    tooltipText?: string,
    /**
     * Intent state of icon.
     * Currently only `success`, `info`, `warning` and `danger` are implemented for icons, even there are more states available.
     */
    intent?: IntentTypes
    /**
     * Display large icon version.
     */
    large?: boolean,
    /**
     * Display small icon version.
     */
    small?: boolean,
    /**
     * Additional CSS classes.
     */
    className?: string,
    /**
     * Description for icon as accessibility fallback.
     */
    description?: string,
    /**
     * Additonal tooltip properties, e.g. `hoverOpenDelay`.
     */
    tooltipProps?: Partial<Omit<TooltipProps, "content" | "children">>,
}

/** Returns the first icon that exists or the fallback icon. */
const findExistingIcon = (
    iconName: ValidIconName | string[],
    fallbackItem: CarbonIconType = canonicalIcons["undefined"]
): CarbonIconType => {
    if (typeof iconName === "string") {
        return canonicalIcons[iconName] ?? fallbackItem;
    } else {
        return canonicalIcons[findExistingIconName(iconName)];
    }
}

/** Returns the first icon name that exists or the fallback icon name. */
export const findExistingIconName = (
    iconNames: string[],
    fallbackIconName: ValidIconName = "undefined"
): ValidIconName => {
    let foundIconName: string = fallbackIconName;
    const iconNameStack = [...iconNames];
    while (foundIconName === fallbackIconName && iconNameStack.length > 0) {
        let iconNameToTest = iconNameStack.shift();
        if (iconNameToTest && (canonicalIcons as any)[iconNameToTest] != null) {
            foundIconName = iconNameToTest;
        }
    }
    return foundIconName as ValidIconName;
}

function Icon({
    className = "",
    name = "undefined",
    large = false,
    small = false,
    tooltipText,
    tooltipProps,
    intent,
    description,
    ...restProps
}: IconProps) {
    let sizeConfig = { height: 20, width: 20, size: 20 };
    if (small) sizeConfig = { height: 16, width: 16, size: 16 };
    if (large) sizeConfig = { height: 32, width: 32, size: 32 };
    const CarbonIconNamed = findExistingIcon(name);

    const icon = (
        <CarbonIconNamed
            {...restProps}
            {...sizeConfig}
            description={ description ?? (tooltipText ?? "")}
            className={
                `${eccgui}-icon ` +
                (intent ? `${eccgui}-intent--${intent} ` : "") +
                className
            }
        />
    );
    return tooltipText ? (
        <Tooltip content={tooltipText} {...tooltipProps}>
            <span>{icon}</span>
        </Tooltip>
    ) : (
        icon
    );
}

export default Icon;
