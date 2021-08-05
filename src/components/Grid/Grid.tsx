import React from "react";
// import PropTypes from 'prop-types';
import { Grid as CarbonGrid } from "carbon-components-react/lib/components/Grid";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Grid({
    children,
    verticalStretchable,
    useAbsoluteSpace,
    className = '',
    ...restProps
}: any) {
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
