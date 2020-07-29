import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function OverviewItemDepiction({
    children,
    className = '',
    ...restProps
}: any) {
    return (
        <div {...restProps} className={`${eccgui}-overviewitem__depiction `+className}>
            {children}
        </div>
    )
}

export default OverviewItemDepiction;
