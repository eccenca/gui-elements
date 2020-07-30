import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ToolbarSection({
    children,
    className = '',
    canGrow = false,
    ...otherProps
}: any) {
    return (
        <div
            {...otherProps}
            className={
                `${eccgui}-toolbar__section` +
                (canGrow ? ` ${eccgui}-toolbar__section--cangrow` : '') +
                (className ? ' ' + className : '')
            }
        >
            { children }
        </div>
    )
}

export default ToolbarSection;
