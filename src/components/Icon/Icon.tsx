import React from "react";
import BaseIcon, { BaseIconProps } from "./BaseIcon";
import canonicalIcons, { CarbonIconType, ValidIconName } from "./canonicalIconNames"

export interface IconProps extends Omit<BaseIconProps, "iconComponent"> {
    /**
     * Canonical icon name, or an array of strings.
     * In case of the array the first valid icon name is used.
     */
    name: ValidIconName | string[],
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

/**
 * The icon provides a graphical symbol that is specified by a canonical name.
 * This name is hard-coded to force a homegenous usage of the [Carbon icon library](https://carbondesignsystem.com/guidelines/icons/library).
 */
function Icon({
    name,
    ...otherBaseIconProps
}: IconProps) {
    return <BaseIcon iconComponent={findExistingIcon(name)} {...otherBaseIconProps} />
}

export default Icon;
