import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function OverviewItemDescription({
    children,
    className = '',
    ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...restProps} className={`${eccgui}-overviewitem__description `+className}>
            {children}
        </div>
    )
}

export default OverviewItemDescription;
