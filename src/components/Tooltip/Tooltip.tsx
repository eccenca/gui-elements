import React from "react";
import {
    Classes as BlueprintClasses,
    Tooltip as BlueprintTooltip,
    TooltipProps as BlueprintTooltipProps,
} from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Markdown, MarkdownProps } from "./../../cmem/markdown/Markdown";

export interface TooltipProps extends Omit<BlueprintTooltipProps, "position"> {
    /**
     * Add dotted underline as visual indication to the target that a tooltip is attached.
     * Should be used together with text-only elements.
     */
    addIndicator?: boolean;
    /**
     * The size specifies the dimension the tooltip overlay element can maximal grow.
     */
    size?: "small" | "medium" | "large";
    /**
     * The tooltip will be attached to this element when it is hovered.
     */
    children: React.ReactNode | React.ReactNode[];
    /**
     * A regular expression that when it matches against the tooltip text, enables the tooltip to be rendered as Markdown.
     * This only works if the tooltip content is a string.
     * Set to `false` to turn off Markdown rendering completely.
     */
    markdownEnabler?: false | string;
    /**
     * Set properties for the Markdown parser
     */
    markdownProps?: Omit<MarkdownProps, "children">;
}

export const Tooltip = ({
    children,
    content,
    className = "",
    size = "medium",
    addIndicator = false,
    markdownEnabler = "\n\n",
    markdownProps,
    ...otherProps
}: TooltipProps) => {
    let tooltipContent = content;

    if (
        typeof content === "string" &&
        typeof markdownEnabler === "string" &&
        new RegExp(markdownEnabler).test(content)
    ) {
        tooltipContent = <Markdown {...markdownProps}>{content}</Markdown>;
    }

    return (
        <BlueprintTooltip
            lazy={true}
            hoverOpenDelay={500}
            {...otherProps}
            content={tooltipContent}
            className={
                `${eccgui}-tooltip__wrapper` +
                (className ? " " + className : "") +
                (addIndicator === true ? " " + BlueprintClasses.TOOLTIP_INDICATOR : "")
            }
            //targetClassName={`${eccgui}-tooltip__target` + (className ? " " + className + "__target" : "")}
            popoverClassName={
                `${eccgui}-tooltip__content` +
                ` ${eccgui}-tooltip--${size}` +
                (className ? " " + className + "__content" : "")
            }
        >
            {children}
        </BlueprintTooltip>
    );
};

export default Tooltip;
