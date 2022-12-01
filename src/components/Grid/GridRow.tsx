import React from "react";
// import PropTypes from 'prop-types';
import { Row as CarbonRow, RowDefaultProps } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface GridRowProps extends RowDefaultProps {
    /**
     * Do not wrap column children when there is not enough space available.
     */
    dontWrapColumns?: boolean
    /**
     * Row uses maximum height of the workview.
     */
    fullHeight?: boolean
    /**
     * When a row is vertical stretched then it uses the remaining spcae on the y-axis.
     * Option can be used on multiple rows, then they share the remaining space.
     * This makes only sense if the grid height is set by additional styles or property.
     * The grid must be set to `verticalStretchable=true`.
     */
    verticalStretched?: boolean
}

/**
 * Grid rows exists as children in a grid and can contain columns.
 */
function GridRow({
    children,
    className = "",
    dontWrapColumns = true,
    fullHeight = false,
    verticalStretched,
    ...otherProps
}: GridRowProps) {
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
}

export default GridRow;
