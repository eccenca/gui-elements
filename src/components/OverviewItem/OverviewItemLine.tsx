import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function OverviewItemLine({
    children,
    className = '',
    small=false,
    large=false,
    ...restProps
}: any) {
    return (
        <div
            {...restProps}
            className={
                `${eccgui}-overviewitem__line ` +
                (small ? `${eccgui}-overviewitem__line--small ` : '' ) +
                (large ? `${eccgui}-overviewitem__line--large ` : '' ) +
                className
            }
        >
            {children}
        </div>
    )
}

export default OverviewItemLine;
