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
 * Contains content of on line in a `OverviewItemDescription` element.
 * It is limited to one line only, text is not break to multiple lines on white spaces.
 * If the content overflows the container then this part of the content is hidden.
 * It does not make sense to include more that 2 or 3 of those lines within one `OverviewItemDescription`.
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
