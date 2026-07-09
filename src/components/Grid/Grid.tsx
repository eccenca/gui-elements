import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface GridProps extends React.HTMLAttributes<HTMLElement> {
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
    /**
     * Collapse the gutter to 1px. Useful for fluid layouts. Kept for API compatibility with
     * the former Carbon grid.
     */
    condensed?: boolean;
    /**
     * Add a row gap to the grid that matches the current gutter size. Kept for API
     * compatibility with the former Carbon grid.
     */
    withRowGap?: boolean;
    /**
     * Grid alignment. Kept for API compatibility with the former Carbon grid; the flexbox
     * grid does not use it (it had no effect in flexbox mode either).
     */
    align?: "start" | "center" | "end";
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
    condensed = false,
    className = "",
    as = "div",
    withRowGap, // eslint-disable-line @typescript-eslint/no-unused-vars -- stripped: no flexbox effect wired up
    align, // eslint-disable-line @typescript-eslint/no-unused-vars -- stripped: ignored by the flexbox grid
    ...restProps
}: GridProps) => {
    const Component = as as React.ElementType;
    return (
        <Component
            {...restProps}
            className={cn(
                `${eccgui}-grid`,
                // full-width container that stays centered when the viewport is wider than it.
                "mx-auto w-full max-w-full",
                verticalStretchable &&
                    // distribute the height over the rows; the `group/gridstretch` + `data-stretchable`
                    // let `GridRow` react (fixed rows vs. stretched rows sharing the remaining height)
                    `${eccgui}-grid--stretchable group/gridstretch flex w-auto flex-col`,
                useAbsoluteSpace &&
                    // fill the positioned parent, insetting left/right by the gutter half.
                    `${eccgui}-grid--absolutespace absolute inset-x-2 inset-y-0`,
                // `group/gridcondensed` + `data-condensed` let descendant `GridColumn`s collapse the gutter
                condensed && `${eccgui}-grid--condensed group/gridcondensed`,
                className,
            )}
            data-stretchable={verticalStretchable ? "true" : undefined}
            data-condensed={condensed ? "true" : undefined}
        >
            {children}
        </Component>
    );
};

export default Grid;
