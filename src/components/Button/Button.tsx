import React from "react";
import {
    AnchorButton as BlueprintAnchorButton,
    Button as BlueprintButton,
    Intent as BlueprintIntent,
} from "@blueprintjs/core";
import Icon from "../Icon/Icon";
import Tooltip, {TooltipProps} from "./../Tooltip/Tooltip";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ButtonProps {
    affirmative?: boolean
    disruptive?: boolean
    elevated?: boolean
    hasStatePrimary?: boolean
    hasStateSuccess?: boolean
    hasStateWarning?: boolean
    hasStateDanger?: boolean
    icon?: string | JSX.Element | null
    rightIcon?: string | JSX.Element | null
    loading?: boolean
    tooltip?: string | JSX.Element | null
    tooltipProperties?: Partial<Omit<TooltipProps, "content" | "children">>
}

function Button({
    children,
    className = "",
    affirmative = false,
    disruptive = false,
    elevated = false,
    hasStatePrimary = false,
    hasStateSuccess = false,
    hasStateWarning = false,
    hasStateDanger = false,
    icon = null,
    rightIcon = null,
    tooltip = null,
    tooltipProperties,
    ...restProps
}: ButtonProps & any) {
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

    let ButtonType = restProps.href ? BlueprintAnchorButton : BlueprintButton;

    const button = (
        <ButtonType
            {...restProps}
            className={`${eccgui}-button ` + className}
            intent={intention}
            icon={typeof icon === "string" ? <Icon name={icon} /> : icon}
            rightIcon={typeof rightIcon === "string" ? <Icon name={rightIcon} /> : rightIcon}
        >
            {children}
        </ButtonType>
    );

    return tooltip
        ? (
            <Tooltip content={tooltip} {...tooltipProperties}>
                <span>{button}</span>
            </Tooltip>
        )
        : button;
}

export default Button;
