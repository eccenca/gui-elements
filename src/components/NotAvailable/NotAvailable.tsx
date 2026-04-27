import React from "react";

import { CLASSPREFIX as eccgui, Tag, TagProps, Tooltip, TooltipProps } from "../../index";
import { TestableComponent } from "../interfaces";
export interface NotAvailableProps
    extends TestableComponent,
        Pick<TagProps, "icon" | "className">,
        Pick<TooltipProps, "intent"> {
    /**
     * Text displayed by the element.
     */
    label?: TagProps["children"];
    /**
     * Add a tooltip to the element.
     * You need to set an empty string `""` to remove it.
     */
    tooltip?: TooltipProps["content"];
    /**
     * Specify the display of the used `Tag` component.
     */
    tagProps?: Omit<TagProps, "icon" | "intent" | "children">;
    /**
     * Specify the display of the used `Tooltip` component.
     */
    tooltipProps?: Omit<TooltipProps, "content" | "intent" | "children">;
    /**
     * Do not use the `Tag` component for the display.
     * The `intent` state can be displayed only on the tooltip then.
     */
    noTag?: boolean;
}

/**
 * Simple placeholder element that can be used to display info about missing data.
 */
export const NotAvailable = ({
    label = "n/a",
    tooltip = "not available",
    icon,
    intent,
    tagProps,
    tooltipProps,
    className,
    noTag = false,
    ...otherProps
}: NotAvailableProps) => {
    const defaultTagProps: TagProps = {
        icon,
        intent,
        emphasis: "weaker",
        className: `${eccgui}-notavailable` + className ? ` ${className}` : "",
    };
    const naElement =
        noTag === false ? (
            <Tag {...defaultTagProps} {...tagProps} {...otherProps}>
                {label ?? "n/a"}
            </Tag>
        ) : (
            <>{label ?? "n/a"}</>
        );
    const defaultTooltipProps: TooltipProps = {
        children: naElement,
        content: tooltip,
        intent,
        addIndicator: noTag,
    };

    return tooltip ? <Tooltip {...defaultTooltipProps} {...tooltipProps} /> : naElement;
};

export default NotAvailable;
