import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

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
                // inside a vertically-stretchable grid (group-data from `Grid`): non-stretched rows are
                // fixed, stretched rows share the remaining vertical space and scroll their overflow.
                verticalStretched
                    ? `${eccgui}-grid__row--stretched group-data-[stretchable=true]/gridstretch:grow group-data-[stretchable=true]/gridstretch:shrink group-data-[stretchable=true]/gridstretch:overflow-y-auto`
                    : "group-data-[stretchable=true]/gridstretch:grow-0 group-data-[stretchable=true]/gridstretch:shrink-0",
                // full workview height minus the block whitespace (the app-shell/header variant lives in
                // Application/_content.scss); 1.75rem = 28px = 2 * `$eccgui-size-block-whitespace`
                fullHeight && `${eccgui}-grid__row--fullheight min-h-[calc(100vh-1.75rem)]`,
                // condensed row: `group/rowcondensed` + `data-condensed` collapse the gutter of its columns
                condensed && `${eccgui}-grid__row--condensed group/rowcondensed`,
                className,
            )}
            data-condensed={condensed ? "true" : undefined}
        >
            {children}
        </div>
    );
};

export default GridRow;
