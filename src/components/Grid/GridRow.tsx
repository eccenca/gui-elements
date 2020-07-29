import React from "react";
// import PropTypes from 'prop-types';
import { Row as CarbonRow } from "carbon-components-react/lib/components/Grid";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function GridRow({ children, className = "", dontWrapColumns = true, fullHeight = false, ...otherProps }: any) {
    return (
        <CarbonRow
            {...otherProps}
            className={
                `${eccgui}-grid__row` +
                (dontWrapColumns ? ` ${eccgui}-grid__row--dontwrapcolumns` : "") +
                (fullHeight ? ` ${eccgui}-grid__row--fullheight` : "") +
                (className ? " " + className : "")
            }
        >
            {children}
        </CarbonRow>
    );
}

export default GridRow;
