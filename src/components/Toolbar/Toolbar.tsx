import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Allow sections to break up into multiple lines when there is not enough space available.
     * Only makes sense for horizontal toolbars.
     */
    noWrap?: boolean;
    /**
     * Toolbar displays vertically like a column.
     * Can be used for toolbars in sidebars.
     */
    verticalStack?: boolean;
}

/**
 * Element to group user-interaction elements.
 */
export const Toolbar = ({
    children,
    className = "",
    noWrap = false,
    verticalStack = false,
    ...restProps
}: ToolbarProps) => {
    return (
        <div
            {...restProps}
            className={cn(
                `${eccgui}-toolbar`,
                noWrap && `${eccgui}-toolbar--nowrap`,
                verticalStack && `${eccgui}-toolbar--vertical`,
                "flex content-center items-center justify-start",
                verticalStack ? "flex-col" : "flex-row",
                noWrap ? "flex-nowrap" : "flex-wrap",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default Toolbar;
