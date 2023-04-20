import React from "react";
// import PropTypes from 'prop-types';
import { Column as CarbonColumn, ColumnDefaultProps } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface GridColumnProps extends Omit<ColumnDefaultProps, "max" | "xlg" | "lg" | "md" | "sm"> {
    /**
     * Column width is small, using 3 (or 2, on medium viewports) parts out of 16.
     * This boolean property is basically a quick switch for setting `{ md:2, lg:3 }`.
     */
    small?: boolean
    /**
     * Column width is medium, using 5 (or 3, on medium viewports) parts out of 16.
     * This boolean property is basically a quick switch for setting `{ md:3, lg:5 }`.
     */
    medium?: boolean
    /**
     * Alignment of column content.
     */
    verticalAlign?: "top" | "center"
    /**
     * @deprecated
     */
    full?: boolean
}

/**
 * Grid columns can be used in grid rows.
 * They can contain other grids if this is necessary for more complex layouts.
 */
function GridColumn({
    children,
    className = '',
    small = false,
    medium = false,
    full,
    verticalAlign = "top",
    ...otherProps
}: GridColumnProps) {
    let sizeConfig = {};
    if (small) sizeConfig = { md:2, lg:3 };
    if (medium) sizeConfig = { md:3, lg:5 };
    return (
        <CarbonColumn
            {...sizeConfig}
            {...otherProps}
            className={
                `${eccgui}-grid__column` +
                (verticalAlign ? ` ${eccgui}-grid__column--vertical-` + verticalAlign : '') +
                (className ? ' '+className : '')
            }
        >
            { children }
        </CarbonColumn>
    )
}

export default GridColumn;
