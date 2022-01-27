import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemLineProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Use it with a small font size.
     */
    small?: boolean;
    /**
     * Use it with a large font size.
     */
    large?: boolean;
}

/**
 * Contains content of on line in a `OverviewItem` element.
 * It does not make sense to include more that 2 or 3 of those elements within `OverviewItem`.
 */
function OverviewItemLine({
    children,
    className = '',
    small=false,
    large=false,
    ...restProps
}: OverviewItemLineProps) {
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
