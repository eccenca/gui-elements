import React from "react";
import { FlexGrid as CarbonGrid } from "@carbon/react";
import { GridProps as CarbonGridProps } from "@carbon/react/es/components/Grid";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface GridProps
    extends Omit<CarbonGridProps<"article" | "section" | "div">, "fullWidth" | "columns" | "narrow" | "as"> {
    /**
     * The available grid height can be distributed between multiple rows.
     * To do so the `verticalStretched` property must be set for the `<GridRow />` element that need to be stretched.
     * This property can be set for multiple rows, then they share the available vertical space regarding their content.
     */
    verticalStretchable?: boolean;
    /**
     * Use the exact space defined by the parent element.
     * This parent element must be displayed using a fixed, relative or absolute position.
     */
    useAbsoluteSpace?: boolean;
    /**
     * Provide a HTML element name to render instead of the default `div`.
     */
    as?: "article" | "section" | "div";
}

/**
 * Layouts a grid that can contain rows and columns.
 * Grids can also be stacked into other grids for more complex layouts.
 * A very complex level of stacked grids is a sign that something should be designed differently.
 */
export const Grid = ({
    children,
    verticalStretchable = false,
    useAbsoluteSpace = false,
    className = "",
    ...restProps
}: GridProps) => {
    return (
        <CarbonGrid
            {...restProps}
            className={
                `${eccgui}-grid` +
                (verticalStretchable ? ` ${eccgui}-grid--stretchable` : "") +
                (useAbsoluteSpace ? ` ${eccgui}-grid--absolutespace` : "") +
                (className ? " " + className : "")
            }
            fullWidth={true}
        >
            {children}
        </CarbonGrid>
    );
};

export default Grid;
