import React from "react";
import { Depiction } from "./../Depiction/Depiction";
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
    // only return Depiction element if it is wrapped inside OverviewItemDepiction
    if (
        typeof children === "object" &&
        !!children &&
        "type" in children &&
        children.type === Depiction
    ) {
        return React.cloneElement(
            children,
            // mimic OverviewItemDepiction "behaviour"
            {
                border: false,
                backgroundColor: "dark",
                ratio: "1:1"
            }
        );
    }
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
