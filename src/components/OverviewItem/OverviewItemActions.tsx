import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function OverviewItemActions ({
    children,
    className = '',
    ...restProps
}: any) {
    return (
        <div {...restProps} className={`${eccgui}-overviewitem__actions `+className}>
            {children}
        </div>
    )
}

export default OverviewItemActions;
