import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Toolbar({
    children,
    className = '',
    noWrap = false,
    verticalStack = false,
    ...restProps
}: any) {
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
