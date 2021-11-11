import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ToolbarSection({
    children,
    className = '',
    canGrow = false,
    canShrink = false,
    hideOverflow = false,
    ...otherProps
}: any) {
    return (
        <div
            {...otherProps}
            className={
                `${eccgui}-toolbar__section` +
                (canGrow ? ` ${eccgui}-toolbar__section--cangrow` : '') +
                (canShrink ? ` ${eccgui}-toolbar__section--canshrink` : '') +
                (hideOverflow ? ` ${eccgui}-toolbar__section--overflowhidden` : '') +
                (className ? ' ' + className : '')
            }
        >
            { children }
        </div>
    )
}

export default ToolbarSection;
