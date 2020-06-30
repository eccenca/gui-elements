import React from "react";
// import PropTypes from 'prop-types';
import { Row as CarbonRow } from "carbon-components-react/lib/components/Grid";

interface IGridRowProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
    dontWrapColumns?: boolean;
    fullHeight?: boolean;
}

function GridRow({ children, className = "", dontWrapColumns = true, fullHeight = false, ...otherProps }: IGridRowProps) {
    return (
        <CarbonRow
            {...otherProps}
            className={
                "ecc-grid__row" +
                (dontWrapColumns ? " ecc-grid__row--dontwrapcolumns" : "") +
                (fullHeight ? " ecc-grid__row--fullheight" : "") +
                (className ? " " + className : "")
            }
        >
            {children}
        </CarbonRow>
    );
}

export default GridRow;
