import React from "react";
// @ts-ignore // FlexGrid is not part of @types/carbon-components-react
import { FlexGrid as CarbonGrid, GridDefaultProps } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface GridProps extends GridDefaultProps {
    /**
     * The grid can be automatically strechted on y-axis.
     * It must be set the `verticalStretched` property on the `<GridRow />` element that need to be stretched.
     * This can be set for multiple rows, then they share the available vertical space regarding their content.
     */
    verticalStretchable?: boolean
    /**
     * Use exact the availble space defined by the parent element.
     * This parent element maust be displayed using a fixed, relative or absolute position.
     */
    useAbsoluteSpace?: boolean
}

/**
 * Layouts a grid that can contain rows and columns.
 * Grids can also be stacked into other grids for more complex layouts.
 * A very complex level of stcked grids is a sign that something should be designed differently.
 */
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
