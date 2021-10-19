import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemDepictionProps extends React.HTMLAttributes<HTMLDivElement> {
    // by default the SVG depictions are displayed light on dark color, this property prevents it
    keepColors?: boolean;
}

function OverviewItemDepiction({
    children,
    className = '',
    keepColors = false,
    ...restProps
}: OverviewItemDepictionProps) {
    return (
        <div
            {...restProps}
            className={
                `${eccgui}-overviewitem__depiction ` +
                (keepColors ? `${eccgui}-overviewitem__depiction--keepcolors ` : "") +
                className
            }
        >
            {children}
        </div>
    )
}

export default OverviewItemDepiction;
