import React from "react";
// import PropTypes from 'prop-types';
import { Grid as CarbonGrid } from "carbon-components-react/lib/components/Grid";

interface IGridProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
}

function Grid({ children, className = '', ...restProps }: IGridProps) {
    return (
        <CarbonGrid {...restProps} className={'ecc-grid '+className} fullWidth={true}>
            { children }
        </CarbonGrid>
    )
}

export default Grid;
