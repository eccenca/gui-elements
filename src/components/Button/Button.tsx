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
     * The button is displayed with primary color scheme.
     * @deprecated (v25) use `intent="primary"` instead.
     */
    hasStatePrimary?: boolean;
    /**
     * The button is displayed with success (some type of green) color scheme.
     *  @deprecated (v25) use `intent="success"` instead.
     */
    hasStateSuccess?: boolean;
    /**
     * The button is displayed with warning (some type of orange) color scheme.
     *  @deprecated (v25) use `intent="warning"` instead.
     */
    hasStateWarning?: boolean;
    /**
     * The button is displayed with danger (some type of red) color scheme.
     *  @deprecated (v25) use `intent="danger"` instead.
     */
    hasStateDanger?: boolean;
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
     * If an URL is set then the button is included as HTML anchor element instead of a button form element.
     */
    //href?: string;
    icon?: ValidIconName | JSX.Element;
    rightIcon?: ValidIconName | JSX.Element;
    //target?: string;
}

interface ExtendedButtonProps extends AdditionalButtonProps, Omit<BlueprintButtonProps, "icon" | "rightIcon"> {}
interface ExtendedAnchorButtonProps
    extends AdditionalButtonProps,
        Omit<BlueprintAnchorButtonProps, "icon" | "rightIcon"> {}

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
    hasStatePrimary = false,
    hasStateSuccess = false,
    hasStateWarning = false,
    hasStateDanger = false,
    icon,
    rightIcon,
    tooltip = null,
    tooltipProps,
    badge,
    badgeProps = { size: "small", position: "top-right", maxLength: 2 },
    intent,
    ...restProps
}: ButtonProps) => {
    let intention;
    switch (true) {
        case affirmative || elevated || hasStatePrimary:
            intention = BlueprintIntent.PRIMARY;
            break;
        case hasStateSuccess:
            intention = BlueprintIntent.SUCCESS;
            break;
        case hasStateWarning:
            intention = BlueprintIntent.WARNING;
            break;
        case disruptive || hasStateDanger:
            intention = BlueprintIntent.DANGER;
            break;
        default:
            break;
    }

    const ButtonType = restProps.href ? BlueprintAnchorButton : BlueprintButton;

    const button = (
        <ButtonType
            {...restProps}
            className={`${eccgui}-button ` + className}
            intent={(intent || intention) as BlueprintIntent}
            icon={typeof icon === "string" ? <Icon name={icon} /> : icon}
            rightIcon={typeof rightIcon === "string" ? <Icon name={rightIcon} /> : rightIcon}
        >
            {children}
            {badge && (
                <Badge
                    children={badge}
                    {...constructBadgeProperties({
                        hasStatePrimary,
                        hasStateSuccess,
                        hasStateWarning,
                        hasStateDanger,
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
    extends Pick<
            ButtonProps,
            "hasStatePrimary" | "hasStateSuccess" | "hasStateWarning" | "hasStateDanger" | "badgeProps"
        >,
        Pick<BlueprintButtonProps, "minimal" | "outlined"> {}

const constructBadgeProperties = ({
    hasStatePrimary,
    hasStateSuccess,
    hasStateWarning,
    hasStateDanger,
    minimal,
    outlined,
    badgeProps = {},
}: constructBadgePropertiesProps) => {
    if (badgeProps.intent) return badgeProps;
    if (hasStatePrimary) badgeProps["intent"] = "accent";
    if (hasStateSuccess) badgeProps["intent"] = "success";
    if (hasStateWarning) badgeProps["intent"] = "warning";
    if (hasStateDanger) badgeProps["intent"] = "danger";
    if (!badgeProps.tagProps || typeof badgeProps.tagProps.minimal === "undefined") {
        if (!minimal && !outlined) {
            badgeProps["tagProps"] = { ...badgeProps.tagProps, minimal: true };
        }
    }
    return badgeProps;
};

export default Button;
