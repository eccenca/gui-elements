import React from "react";
// import PropTypes from 'prop-types';
import { Grid as CarbonGrid } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {GridDefaultProps} from "carbon-components-react/lib/components/Grid/Grid";

interface GridProps extends GridDefaultProps {
    verticalStretchable?: boolean
    useAbsoluteSpace?: boolean
}

function Grid({
    children,
    verticalStretchable = false,
    useAbsoluteSpace = false,
    className = '',
    ...restProps
}: GridProps) {
    return (
        <CarbonGrid
            {...restProps}
            className={
                `${eccgui}-grid` +
                (!!verticalStretchable ? ` ${eccgui}-grid--stretchable` : "") +
                (!!useAbsoluteSpace ? ` ${eccgui}-grid--absolutespace` : "") +
                (className ? " " + className : "")
            }
            fullWidth={true}
        >
            { children }
        </CarbonGrid>
    )
}

export default Grid;
