import React, { memo } from "react";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { Tooltip, TooltipProps } from "../../../index";

export interface HandleContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
    /**
     * Tooltip displayed as overlay on hover.
     */
    extendedTooltip?: JSX.Element | string;
    /**
     * Configure the tooltip and overwrite automatically set options.
     */
    tooltipProps?: Omit<TooltipProps, "content" | "children" | "renderTarget">;
}

export const HandleContent = memo(
    ({ children, extendedTooltip, tooltipProps, ...otherDivProps }: HandleContentProps) => {
        const handleContent = children ? (
            <div className={`${eccgui}-graphviz__handle__content`} {...otherDivProps}>
                {children}
            </div>
        ) : extendedTooltip ? (
            <div className={`${eccgui}-graphviz__handle__content`} {...otherDivProps} />
        ) : (
            <></>
        );

        if (extendedTooltip && tooltipProps?.isOpen) {
            return (
                <Tooltip
                    content={extendedTooltip}
                    autoFocus={false}
                    enforceFocus={false}
                    openOnTargetFocus={false}
                    {...tooltipProps}
                >
                    {handleContent}
                </Tooltip>
            );
        }

        return handleContent;
    }
);
