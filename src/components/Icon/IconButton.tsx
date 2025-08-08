import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Button, { ButtonProps } from "../Button/Button";

import { ValidIconName } from "./canonicalIconNames";
import Icon, { IconProps } from "./Icon";
import { TestIconProps } from "./TestIcon";
import {TestableComponent} from "../interfaces";

interface ExtendedButtonProps
    extends Omit<ButtonProps, "name" | "icon" | "rightIcon" | "text" | "minimal" | "tooltip">, TestableComponent {
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

export type IconButtonProps = ExtendedButtonProps;

/** A button with an icon instead of text. */
export const IconButton = ({
    className = "",
    name = "undefined",
    text,
    tooltipProps,
    description,
    tooltipAsTitle = false,
    minimal = true,
    ...restProps
}: IconButtonProps) => {
    const defaultIconTooltipProps = {
        hoverOpenDelay: 1000,
        openOnTargetFocus: restProps.disabled || (restProps.tabIndex ?? 0) < 0 ? false : undefined,
    };
    const iconProps = {
        small: restProps.small,
        large: restProps.large,
        tooltipText: tooltipAsTitle ? undefined : text,
        tooltipProps: tooltipProps
            ? {
                  ...defaultIconTooltipProps,
                  ...tooltipProps,
              }
            : defaultIconTooltipProps,
        description: description ? description : text,
    };

    return (
        <Button
            tabIndex={text && !tooltipAsTitle ? -1 : undefined}
            title={tooltipAsTitle && text ? text : undefined}
            {...restProps}
            icon={
                typeof name === "string" || Array.isArray(name) ? (
                    <Icon name={name as IconProps["name"]} {...iconProps} />
                ) : (
                    React.cloneElement(name, iconProps)
                )
            }
            className={`${eccgui}-button--icon ` + className}
            minimal={minimal}
        />
    );
};

export default IconButton;
