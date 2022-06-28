import React from "react";
import {
    Classes as BlueprintClassNames,
    Tooltip as BlueprintTooltip,
    TooltipProps as BlueprintTooltipProps
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TooltipProps extends BlueprintTooltipProps {
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
     * The tolltip will be attached to this element when it is hovered.
     */
    children: React.ReactNode | React.ReactNode[];
}

function Tooltip({
    children,
    content,
    className = "",
    size = "medium",
    addIndicator = false,
    ...otherProps
}: TooltipProps) {
    return (
        <BlueprintTooltip
            lazy={true}
            hoverOpenDelay={500}
            {...otherProps}
            content={content}
            className={
                `${eccgui}-tooltip__wrapper` +
                (className ? " " + className : "") +
                (addIndicator === true ? " " + BlueprintClassNames.TOOLTIP_INDICATOR : "")
            }
            targetClassName={`${eccgui}-tooltip__target` + (className ? " " + className + "__target" : "")}
            popoverClassName={
                `${eccgui}-tooltip__content` +
                ` ${eccgui}-tooltip--${size}` +
                (className ? " " + className + "__content" : "")
            }
        >
            {children}
        </BlueprintTooltip>
    );
}

export default Tooltip;
