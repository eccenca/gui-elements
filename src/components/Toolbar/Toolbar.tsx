import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Toolbar({
    children,
    className = '',
    noWrap = false,
    ...restProps
}: any) {
    return (
        <div
            {...restProps}
            className={
                `${eccgui}-toolbar ` +
                (noWrap ? ` ${eccgui}-toolbar--nowrap` : '') +
                (className ? ' ' + className : '')
            }
        >
            { children }
        </div>
    )
}

export default Toolbar;
