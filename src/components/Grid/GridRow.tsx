import React from "react";
// import PropTypes from 'prop-types';
import { Row as CarbonRow } from "@carbon/react";
import { RowProps as CarbonRowProps } from "@carbon/react/es/components/Grid/Row";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface GridRowProps extends Omit<CarbonRowProps<"div">, "narrow"> {
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
}

/**
 * Grid rows exists as children in a grid and can contain columns.
 */
export const GridRow = ({
    children,
    className = "",
    dontWrapColumns = true,
    fullHeight = false,
    verticalStretched,
    ...otherProps
}: GridRowProps) => {
    return (
        <CarbonRow
            {...otherProps}
            className={
                `${eccgui}-grid__row` +
                (dontWrapColumns ? ` ${eccgui}-grid__row--dontwrapcolumns` : "") +
                (verticalStretched ? ` ${eccgui}-grid__row--stretched` : "") +
                (fullHeight ? ` ${eccgui}-grid__row--fullheight` : "") +
                (className ? " " + className : "")
            }
        >
            {children}
        </CarbonRow>
    );
};

export default GridRow;
