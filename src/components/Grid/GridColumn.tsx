import React from "react";
// import PropTypes from 'prop-types';
import { Column as CarbonColumn } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {ColumnDefaultProps} from "carbon-components-react/lib/components/Grid/Column";

interface GridColumnProps extends ColumnDefaultProps {
    small?: boolean
    medium?: boolean
    full?: boolean
    verticalAlign?: "center"
}

function GridColumn({
    children,
    className = '',
    small = false,
    medium = false,
    full = true,
    verticalAlign,
    ...otherProps
}: GridColumnProps) {
    let sizeConfig = {};
    if (small) sizeConfig = { md:2, lg:3 };
    if (medium) sizeConfig = { md:3, lg:5 };
    return (
        <CarbonColumn
            {...otherProps}
            {...sizeConfig}
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
