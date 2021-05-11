import React from "react";
import { Classes as BlueprintClassNames, Tooltip as BlueprintTooltip } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {ITooltipProps} from "@blueprintjs/core/lib/esm/components/tooltip/tooltip";

interface ITooltip {
    className?: string
    addIndicator?: boolean
    /** Blueprint specific tooltip props */
    tooltipProps?: Partial<ITooltipProps>
    /** The content that is displayed when hovering over the tooltip area. */
    content: JSX.Element | string
    children: React.ReactNode | React.ReactNode[]
    /** @deprecated Use tooltipProps for Blueprint specific props or add concrete properties in all other cases. */
    [key: string]: any
}

function Tooltip({ children, content, className = "", addIndicator = false, tooltipProps = {}, ...otherProps }: ITooltip) {
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
            popoverClassName={`${eccgui}-tooltip__content` + (className ? " " + className + "__content" : "")}
        >
            {children}
        </BlueprintTooltip>
    );
}

export default Tooltip;
