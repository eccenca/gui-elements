import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
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
function Toolbar({
    children,
    className = '',
    noWrap = false,
    verticalStack = false,
    ...restProps
}: ToolbarProps) {
    return (
        <div
            {...restProps}
            className={
                `${eccgui}-toolbar ` +
                (noWrap ? ` ${eccgui}-toolbar--nowrap` : '') +
                (verticalStack ? ` ${eccgui}-toolbar--vertical` : '') +
                (className ? ' ' + className : '')
            }
        >
            { children }
        </div>
    )
}

export default Toolbar;
