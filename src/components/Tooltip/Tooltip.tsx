import React from "react";
import { Classes as BlueprintClassNames, Tooltip as BlueprintTooltip } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {TooltipProps as BlueprintTooltipProps} from "@blueprintjs/core";

export interface TooltipProps {
    className?: string
    addIndicator?: boolean
    /** Blueprint specific tooltip props */
    tooltipProps?: Partial<BlueprintTooltipProps>
    /** The content that is displayed when hovering over the tooltip area. */
    content: JSX.Element | string
    /** The size specifies the dimension the element can maximal grow. */
    size?: "small" | "medium" | "large"
    children: React.ReactNode | React.ReactNode[]
    /** @deprecated Use tooltipProps for Blueprint specific props or add concrete properties in all other cases. */
    [key: string]: any
}

function Tooltip({
    children,
    content,
    className = "",
    size = "medium",
    addIndicator = false,
    tooltipProps = {},
    ...otherProps
}: TooltipProps) {
    return (
        <BlueprintTooltip
            lazy={true}
            hoverOpenDelay={500}
            {...otherProps}
            content={content}
            {...tooltipProps}
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
