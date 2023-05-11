import React from "react";
import Button, { ButtonProps, AnchorOrButtonProps } from "../Button/Button";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";
import Icon from "./Icon";
import { TestIconProps } from "./TestIcon";
import {ValidIconName} from "./canonicalIconNames";

interface ExtendedButtonProps extends Omit<ButtonProps, "icon" | "rightIcon" | "text" | "minimal" | "tooltip"> {
    /**
     * Canonical icon name, or an array of strings.
     * In case of the array the first valid icon name is used.
     */
    name: ValidIconName | string[] | React.ReactElement<TestIconProps>;
    /**
     * Button text, will be displayed as tooltip.
     */
    text?: string;
    /**
     * If `text` should be set as HTML `title` attribute instead of attaching it as tooltip.
     * If true then `tooltipProps` is ignored.
     */
    tooltipAsTitle?: boolean;
    /**
     * Description for icon as accessibility fallback.
     * If not set then `text` is used.
     */
    description?: string;
    /**
     * Button is displayed with minimal styles (no borders, no background color).
     */
    minimal?: boolean;
}

export type IconButtonProps = ExtendedButtonProps & AnchorOrButtonProps;

/** A button with an icon instead of text. */
export const IconButton = ({
    className = "",
    name = "undefined",
    text,
    tooltipProps,
    description,
    tooltipAsTitle = false,
    minimal=true,
    ...restProps
}: IconButtonProps) => {
    const iconProps = {
        small: restProps.small,
        large: restProps.large,
        tooltipText: tooltipAsTitle ? undefined : text,
        tooltipProps: !!tooltipProps ? {hoverOpenDelay: 1000, ...tooltipProps} : {hoverOpenDelay: 1000},
        description: description ? description : text,
    };

    return (
        <Button
            title={tooltipAsTitle && text ? text : undefined}
            {...restProps}
            icon={(typeof name === "string" || Array.isArray(name)) ? (
                <Icon name={name} {...iconProps} />
            ) : (
                React.cloneElement(name, iconProps)
            )}
            className={`${eccgui}-button--icon ` + className}
            minimal={minimal}
        />
    );
}

export default IconButton;
