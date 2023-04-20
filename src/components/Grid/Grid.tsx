import React from "react";
// @ts-ignore // FlexGrid is not part of @types/carbon-components-react
import { FlexGrid as CarbonGrid, GridDefaultProps } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface GridProps extends Omit<GridDefaultProps, "fullWidth" | "columns" | "narrow"> {
    /**
     * The available grid height can be distributed between multiple rows.
     * To do so the `verticalStretched` property must be set for the `<GridRow />` element that need to be stretched.
     * This property can be set for multiple rows, then they share the available vertical space regarding their content.
     */
    verticalStretchable?: boolean
    /**
     * Use the exact space defined by the parent element.
     * This parent element must be displayed using a fixed, relative or absolute position.
     */
    useAbsoluteSpace?: boolean
    /**
     * @deprecated
     * This is set always by default.
     */
    fullWidth?: boolean
}

/**
 * Layouts a grid that can contain rows and columns.
 * Grids can also be stacked into other grids for more complex layouts.
 * A very complex level of stacked grids is a sign that something should be designed differently.
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
