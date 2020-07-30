import React from "react";
// import PropTypes from 'prop-types';
import { Grid as CarbonGrid } from "carbon-components-react/lib/components/Grid";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface IGridProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
        set of GridRow elements
    */
    children?: React.ReactNode;
    /**
        space-delimited list of class names
    */
    className?: string;
}

function Grid({ children, className = '', ...restProps }: IGridProps) {
    return (
        <CarbonGrid {...restProps} className={`${eccgui}-grid ` + className} fullWidth={true}>
            { children }
        </CarbonGrid>
    )
}

export default Grid;
