import React from "react";
// import PropTypes from 'prop-types';
import { Column as CarbonColumn } from "carbon-components-react/lib/components/Grid";

interface IGridColumnProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        use only very small horizontal space of the row
    */
    small?: boolean;
    /**
        use medium horizontal space of the row
    */
    medium?: boolean;
    /**
        use all available horizontal space from the row, if you use multiple of those columns they share the space equally
    */
    full?: boolean;
    /**
        vertical align of the colum in the row, currently only "top" (default) and "center" are available
    */
    verticalAlign?: "top" | "center";
}

function GridColumn({
    children,
    className = '',
    small = false,
    medium = false,
    full = true,
    verticalAlign = "top",
    ...otherProps
}: IGridColumnProps) {
    let sizeConfig = {};
    if (small) sizeConfig = { md:2, lg:3 };
    if (medium) sizeConfig = { md:3, lg:5 };
    return (
        <CarbonColumn
            {...otherProps}
            {...sizeConfig}
            className={
                'ecc-grid__column' +
                (verticalAlign ? ' ecc-grid__column--vertical-'+verticalAlign : '') +
                (className ? ' '+className : '')
            }
        >
            { children }
        </CarbonColumn>
    )
}

export default GridColumn;
