import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Do not wrap column children when there is not enough space available.
     * This only works for grids on medium sized and larger viewports.
     */
    dontWrapColumns?: boolean;
    /**
     * Row uses maximum height of the workview.
     */
    fullHeight?: boolean;
    /**
     * When a row is vertically stretched then it uses the remaining spcae on the y-axis.
     * Option can be used on multiple rows, then they share the available space.
     * This makes only sense if the grid height is set by additional styles or properties.
     * The grid must be set to `verticalStretchable=true`.
     */
    verticalStretched?: boolean;
    /**
     * Collapse the gutter of this single row. Kept for API compatibility with the former
     * Carbon grid row.
     */
    condensed?: boolean;
}

/**
 * Grid rows exists as children in a grid and can contain columns.
 */
export const GridRow = ({
    children,
    className = "",
    dontWrapColumns = true,
    fullHeight = false,
    verticalStretched = false,
    condensed = false,
    ...otherProps
}: GridRowProps) => {
    return (
        <div
            {...otherProps}
            className={cn(
                `${eccgui}-grid__row`,
                // flex row with negative inline margin (= gutter half) so column paddings align.
                "-mx-2 flex flex-wrap",
                dontWrapColumns &&
                    // Carbon "medium" breakpoint (42rem); stop wrapping from there upwards.
                    `${eccgui}-grid__row--dontwrapcolumns [@media(min-width:42rem)]:flex-nowrap`,
                verticalStretched && `${eccgui}-grid__row--stretched`,
                fullHeight && `${eccgui}-grid__row--fullheight`,
                condensed && `${eccgui}-grid__row--condensed`,
                className,
            )}
        >
            {children}
        </div>
    );
};

export default GridRow;
