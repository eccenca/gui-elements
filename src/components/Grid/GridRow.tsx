import React from "react";
// import PropTypes from 'prop-types';
import { Row as CarbonRow } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {RowDefaultProps} from "carbon-components-react/lib/components/Grid/Row";

interface GridRowProps extends RowDefaultProps {
    dontWrapColumns?: boolean
    fullHeight?: boolean
    verticalStretched?: boolean
}

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
