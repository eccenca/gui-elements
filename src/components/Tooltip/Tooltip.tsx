import React from "react";
import {
    Classes as BlueprintClassNames,
    Tooltip as BlueprintTooltip,
    TooltipProps as BlueprintTooltipProps
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TooltipProps extends BlueprintTooltipProps {
    className?: string
    addIndicator?: boolean
    /** The content that is displayed when hovering over the tooltip area. */
    content: JSX.Element | string
    /** The size specifies the dimension the element can maximal grow. */
    size?: "small" | "medium" | "large"
    children: React.ReactNode | React.ReactNode[]
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
