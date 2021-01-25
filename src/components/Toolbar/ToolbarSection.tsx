import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ToolbarSection({
    children,
    className = '',
    canGrow = false,
    canShrink = false,
    ...otherProps
}: any) {
    return (
        <div
            {...otherProps}
            className={
                `${eccgui}-toolbar__section` +
                (canGrow ? ` ${eccgui}-toolbar__section--cangrow` : '') +
                (canShrink ? ` ${eccgui}-toolbar__section--canshrink` : '') +
                (className ? ' ' + className : '')
            }
        >
            { children }
        </div>
    )
}

export default ToolbarSection;
