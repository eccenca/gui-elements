import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Tooltip from "./../Tooltip/Tooltip";
import canonicalIconNames from "./canonicalIconNames.json";

/*
    Properties from us:

    * name: string, our defined canonical icon name
*/

/*
    Properties from parent (Carbon Icon)

// The CSS class name.
className: string,
// The icon title.
iconTitle: string,
// The icon description.
description: string.isRequired,
// The `role` attribute. (default: img)
role: string,
// The CSS styles.
style: object,

for more see https://www.npmjs.com/package/@carbon/icons-react

*/

// TODO: add properties for intention/state (e.g. success, info, earning, error)

export interface IIconProps extends React.HTMLAttributes<SVGElement>, React.AriaAttributes {
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        icon name, if not know then "undefined" is used
    */
    name: string | string[]; // TODO: do we want this limited to only the canonical names so an error is thrown?
    /**
        icon description, could be used to increase accessibility
    */
    description?: string; // TODO: do we want this have mandatory?
    /**
        use large display of icon
    */
    large?: boolean;
    /**
        use small display of icon
    */
    small?: boolean;
    /**
        tooltip text, if given then a tooltip is added to the icon
    */
    tooltipText?: React.ReactNode;
    /**
        how long is the delay until the tooltip is open when the user hover an icon
    */
    tooltipOpenDelay?: number;
}

function Icon({
    className = "",
    name = "undefined",
    large = false,
    small = false,
    tooltipText,
    tooltipOpenDelay,
    ...restProps
}: IIconProps) {
    let sizeConfig = { height: 20, width: 20 };
    if (small) sizeConfig = { height: 16, width: 16 };
    if (large) sizeConfig = { height: 32, width: 32 };

    let iconNameStack = typeof name === "string" ? [name] : name;
    const iconNameFallback = "Undefined" + sizeConfig.width;
    let iconImportName = iconNameFallback;
    while (iconImportName === iconNameFallback && iconNameStack.length > 0) {
        let nameTest = iconNameStack.shift();
        if (typeof canonicalIconNames[nameTest] !== "undefined") {
            iconImportName = canonicalIconNames[nameTest] + sizeConfig.width;
        }
    }

    const CarbonIcon = require("@carbon/icons-react")[iconImportName];
    // Workaround to prevent warnings because of tabIndex of type 'number' instead of 'string'
    const restPropsWithFixedTabIndexWorkaround = {
        ...restProps,
        tabIndex: restProps.tabIndex !== undefined ? "" + restProps.tabIndex : undefined,
    };
    const icon = (
        <CarbonIcon {...restPropsWithFixedTabIndexWorkaround} {...sizeConfig} className={`${eccgui}-icon ` + className} />
    );
    return tooltipText ? (
        <Tooltip content={tooltipText} hoverOpenDelay={tooltipOpenDelay}>
            <span>{icon}</span>
        </Tooltip>
    ) : (
        icon
    );
}

export default Icon;
