import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> { 
    /** 
     * when set will allow content to overflow and not wrap
     */
     noWrap?: boolean;
     /** 
      * when set to true will arrange items vertically
      */
     verticalStack?: boolean;
}

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
