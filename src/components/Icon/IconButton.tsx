import React from "react";
import Button, {ButtonProps} from "../Button/Button";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from "./Icon";
import {TooltipProps} from "@gui-elements/src/components/Tooltip/Tooltip";
import {ActionProps} from "@blueprintjs/core";

interface IconButtonProps extends Partial<HTMLButtonElement>, Omit<ActionProps, "icon">, ButtonProps {
    // Canonical icon name
    name: string
    className?: string
    // Tooltip text
    text?: string,
    // Time after tooltip text is viible when icon is hovered/focuses
    tooltipOpenDelay?: number,
    // Other tooltip properties
    tooltipProperties?: TooltipProps,
    // Display large icon version
    large?: boolean,
    // Display small icon version
    small?: boolean
    // If the tooltip should be set as title attribute instead of the Tooltip component. If true, all other tooltip parameters are ignored.
    tooltipAsTitle?: boolean
    // If set, button will become an anchor button. FIXME: Setting this parameter should not change the type of the button. Split into several components.
    href?: string
}

/** A button with an icon instead of text. */
function IconButton({ className = "", name = "undefined", text, tooltipProperties, tooltipOpenDelay = 1000, tooltipAsTitle = false, ...restProps }: IconButtonProps) {
    return (
        <Button
            title={tooltipAsTitle && text ? text : undefined}
            {...restProps}
            icon={
                <Icon
                    name={name}
                    small={restProps.small}
                    large={restProps.large}
                    tooltipText={tooltipAsTitle ? undefined : text}
                    tooltipOpenDelay={tooltipOpenDelay}
                    tooltipProperties={!!tooltipProperties ? tooltipProperties : {}}
                    tooltipAsTitle={tooltipAsTitle}
                />
            }
            className={`${eccgui}-button--icon ` + className}
            minimal
        />
    );
}

export default IconButton;
