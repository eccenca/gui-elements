import React, { memo } from "react";

import Tooltip, { TooltipProps } from "@/components/atoms/Tooltip/Tooltip";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface HandleContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
    /**
     * Tooltip displayed as overlay on hover.
     */
    extendedTooltip?: React.JSX.Element | string;
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
            // The extra modifier shrinks this tooltip anchor to a 0x0 point at the handle center
            // (see index.css) so it can never swallow the pointer events react-flow needs for
            // connection drag & drop on the handle.
            <div
                className={`${eccgui}-graphviz__handle__content ${eccgui}-graphviz__handle__content--extendedTooltip`}
                {...otherDivProps}
            />
        ) : (
            <></>
        );

        if (extendedTooltip) {
            return (
                <Tooltip
                    content={extendedTooltip}
                    autoFocus={false}
                    enforceFocus={false}
                    openOnTargetFocus={false}
                    usePlaceholder={false}
                    {...tooltipProps}
                >
                    {handleContent}
                </Tooltip>
            );
        }

        return handleContent;
    },
);
