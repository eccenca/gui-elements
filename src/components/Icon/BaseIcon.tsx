import React from "react";
import { CarbonIconProps, CarbonIconType } from "@carbon/react/icons";

import { IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import Tooltip, { TooltipProps } from "./../Tooltip/Tooltip";

export interface BaseIconProps extends Omit<CarbonIconProps, "icon" | "description" | "name"> {
    /**
     * Carbon icon component that is used.
     */
    iconComponent: CarbonIconType;
    /**
     * Add tooltip text to icon
     */
    tooltipText?: string;
    /**
     * Intent state of icon.
     * Currently only `success`, `info`, `warning` and `danger` are implemented for icons, even there are more states available.
     */
    intent?: IntentTypes;
    /**
     * Display large icon version.
     */
    large?: boolean;
    /**
     * Display small icon version.
     */
    small?: boolean;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Description for icon as accessibility fallback.
     * @deprecated (v25) Use `title` as replacement.
     */
    description?: string;
    /**
     * Additonal tooltip properties, e.g. `hoverOpenDelay`.
     */
    tooltipProps?: Partial<Omit<TooltipProps, "content" | "children">>;
    /**
     * @deprecated (v25) Use `title` as replacement.
     */
    iconTitle?: CarbonIconProps["title"];
}

/**
 * The base icon provides the basic functionality that is necessary to wrap the Carbon icon component.
 */
function BaseIcon({
    iconComponent,
    className = "",
    large = false,
    small = false,
    tooltipText,
    tooltipProps,
    intent,
    description,
    iconTitle,
    tabIndex,
    ...restProps
}: BaseIconProps) {
    let sizeConfig = { height: 20, width: 20, size: 20 };
    if (small) sizeConfig = { height: 16, width: 16, size: 16 };
    if (large) sizeConfig = { height: 32, width: 32, size: 32 };
    const CarbonIconNamed = iconComponent;

    const icon = (
        <CarbonIconNamed
            title={
                iconTitle || description ? (iconTitle ? iconTitle : description ? description : undefined) : undefined
            }
            {...restProps}
            {...sizeConfig}
            className={
                `${eccgui}-icon` + (intent ? ` ${eccgui}-intent--${intent}` : "") + (className ? ` ${className}` : "")
            }
            // @ts-ignore tabIndex is number but internally Carbon defined it as string propType.
            tabIndex={typeof tabIndex !== "undefined" ? tabIndex.toString() : undefined}
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

export default BaseIcon;
