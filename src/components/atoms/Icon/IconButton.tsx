import React from "react";

import Button, { ButtonProps } from "@/components/atoms/Button/Button";
import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import { ValidIconName } from "./canonicalIconNames";
import Icon, { IconProps } from "./Icon";
import { TestIconProps } from "./TestIcon";

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
const IconButtonInner = (
    {
        className = "",
        name = "undefined",
        text,
        tooltipProps,
        description,
        tooltipAsTitle = false,
        minimal = true,
        ...restProps
    }: IconButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) => {
    const defaultIconTooltipProps = {
        hoverOpenDelay: 1000,
        openOnTargetFocus: restProps.disabled || (restProps.tabIndex ?? 0) < 0 ? false : undefined,
        swapPlaceholderDelay: 10,
    };
    const iconProps = {
        // Medium (default) and small icon buttons render 16px (`small`) icons, large ones the
        // 20px default (never the 32px `large` glyph, which would fill the `size-9` box edge to
        // edge). Mirrors `Button`'s sizing.
        small: restProps.size !== "large" && !restProps.large,
        large: false,
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
            ref={ref}
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

/**
 * A button with an icon instead of text.
 *
 * The `ref` is forwarded through to the underlying `Button` element so `IconButton` can be used as
 * the child of a Radix `asChild` trigger (e.g. the default toggler of `ContextMenu`).
 */
export const IconButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>(IconButtonInner);
IconButton.displayName = "IconButton";

export default IconButton;
