import React from "react";
import Button, { ButtonProps, AnchorOrButtonProps } from "../Button/Button";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";
import Icon from "./Icon";
import {ValidIconName} from "./canonicalIconNames";

interface IconButtonProps extends Omit<ButtonProps, "icon" | "rightIcon" | "text" | "minimal" | "tooltip"> {
    /**
     * Canonical icon name, or an array of strings.
     * In case of the array the first valid icon name is used.
     */
    name: ValidIconName | string[]
    /**
     * Button text, will be displayed as tooltip.
     */
    text?: string,
    /**
     * If `text` should be set as HTML `title` attribute instead of attaching it as tooltip.
     * If true then `tooltipProps` is ignored.
     */
    tooltipAsTitle?: boolean
    /**
     * Description for icon as accessibility fallback.
     * If not set then `text` is used.
     */
    description?: string
    /**
     * Button is displayed with minimal styles (no borders, no background color).
     */
    minimal?: boolean;
}

/** A button with an icon instead of text. */
function IconButton({
    className = "",
    name = "undefined",
    text,
    tooltipProps,
    description,
    tooltipAsTitle = false,
    minimal=true,
    ...restProps
}: IconButtonProps & AnchorOrButtonProps) {
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
                    tooltipProps={!!tooltipProps ? {hoverOpenDelay: 1000, ...tooltipProps} : {hoverOpenDelay: 1000}}
                    description={description ? description : text}
                />
            }
            className={`${eccgui}-button--icon ` + className}
            minimal={minimal}
        />
    );
}

export default IconButton;
