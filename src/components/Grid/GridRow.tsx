import React from "react";
// import PropTypes from 'prop-types';
import { Row as CarbonRow } from "carbon-components-react/lib/components/Grid";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface IGridRowProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
        set of GridColumn elements
    */
    children?: React.ReactNode;
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        do not automatically wrap columns if grid row has not enough horizontal space for them
    */
    dontWrapColumns?: boolean;
    /**
        row uses full available viewport height as minimal size
    */
    fullHeight?: boolean;
}

function GridRow({ children, className = "", dontWrapColumns = true, fullHeight = false, ...otherProps }: IGridRowProps) {
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
