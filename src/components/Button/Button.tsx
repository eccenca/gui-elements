import React from "react";
import {
    AnchorButton as BlueprintAnchorButton,
    AnchorButtonProps as BlueprintAnchorButtonProps,
    Button as BlueprintButton,
    ButtonProps as BlueprintButtonProps,
    Intent as BlueprintIntent,
} from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { ValidIconName } from "../Icon/canonicalIconNames";
import Icon from "../Icon/Icon";

import Badge, { BadgeProps } from "./../Badge/Badge";
import Tooltip, { TooltipProps } from "./../Tooltip/Tooltip";

interface AdditionalButtonProps {
    /**
     * Always use this when the button triggers an affirmative action, e.g. confirm a process.
     * The button is displayed with primary color scheme.
     */
    affirmative?: boolean;
    /**
     * Always use this when the button triggers an disruptive action, e.g. delete or remove.
     * The button is displayed with primary color scheme.
     */
    disruptive?: boolean;
    /**
     * Use this when a button is important enough to highlight it in a set of other buttons.
     * The button is displayed with primary color scheme.
     */
    elevated?: boolean;
    /**
     * Intent state visualized by color.
     */
    intent?: BlueprintIntent | "accent";
    /**
     * Content displayed in a badge that is attached to the button.
     * By default it is displayed `{ size: "small", position: "top-right", maxLength: 2 }` and with the same intent state of the button.
     * Use `badgeProps` to change that default behaviour.
     */
    badge?: BadgeProps["children"];
    /**
     * Object with additional properties for the badge.
     */
    badgeProps?: Partial<Omit<BadgeProps, "children">>;
    /**
     * takes in either a string of text or a react element to display as a tooltip when the button is hovered.
     */
    tooltip?: string | JSX.Element | null;
    /**
     * Object with additional properties for the tooltip.
     */
    tooltipProps?: Partial<Omit<TooltipProps, "content" | "children">>;
    /**
     * Icon displayed on button start.
     */
    icon?: ValidIconName | JSX.Element;
    /**
     * Icon displayed on button end.
     */
    rightIcon?: ValidIconName | JSX.Element;
}

interface ExtendedButtonProps
    extends AdditionalButtonProps,
        Omit<BlueprintButtonProps, "intent" | "icon" | "rightIcon"> {}
interface ExtendedAnchorButtonProps
    extends AdditionalButtonProps,
        Omit<BlueprintAnchorButtonProps, "intent" | "icon" | "rightIcon"> {}

export type ButtonProps = ExtendedButtonProps & ExtendedAnchorButtonProps;

/**
 * Display a button element to enable user interaction.
 * It normally should trigger action when clicked.
 */
export const Button = ({
    children,
    className = "",
    affirmative = false,
    disruptive = false,
    elevated = false,
    icon,
    rightIcon,
    tooltip = null,
    tooltipProps,
    badge,
    badgeProps = { size: "small", position: "top-right", maxLength: 2 },
    intent,
    ...restProps
}: ButtonProps) => {
    let intentByFunction;
    switch (true) {
        case affirmative || elevated:
            intentByFunction = "accent";
            break;
        case disruptive:
            intentByFunction = BlueprintIntent.DANGER;
            break;
        default:
            break;
    }

    const ButtonType = restProps.href ? BlueprintAnchorButton : BlueprintButton;

    const button = (
        <ButtonType
            {...restProps}
            className={`${eccgui}-button ` + className}
            intent={(intent || intentByFunction) as BlueprintIntent}
            icon={typeof icon === "string" ? <Icon name={icon} /> : icon}
            rightIcon={typeof rightIcon === "string" ? <Icon name={rightIcon} /> : rightIcon}
        >
            {children}
            {badge && (
                <Badge
                    children={badge}
                    {...constructBadgeProperties({
                        intent,
                        minimal: restProps.minimal,
                        outlined: restProps.outlined,
                        badgeProps,
                    })}
                />
            )}
        </ButtonType>
    );

    return tooltip && !restProps.loading ? (
        <Tooltip content={tooltip} {...tooltipProps}>
            <span>{button}</span>
        </Tooltip>
    ) : (
        button
    );
};

interface constructBadgePropertiesProps
    extends Pick<ButtonProps, "intent" | "badgeProps">,
        Pick<BlueprintButtonProps, "minimal" | "outlined"> {}

const constructBadgeProperties = ({ intent, minimal, outlined, badgeProps = {} }: constructBadgePropertiesProps) => {
    if (badgeProps.intent) return badgeProps;
    if (intent) badgeProps["intent"] = intent;
    if (!badgeProps.tagProps || typeof badgeProps.tagProps.minimal === "undefined") {
        if (!minimal && !outlined) {
            badgeProps["tagProps"] = { ...badgeProps.tagProps, minimal: true };
        }
    }
    return badgeProps;
};

export default Button;
