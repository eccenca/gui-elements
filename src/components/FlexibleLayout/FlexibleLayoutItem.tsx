import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface FlexibleLayoutItemProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Defines the ability for the item to grow.
     * The factor defines how much space the item would take up compared to the other items with a grow factor greater than zero.
     * Must be equal or greater than zero.
     * With a factor of `0` the item cannot grow.
     */
    growFactor?: number;
    /**
     * Defines the ability for the item to shrink.
     * The factor defines how strong the shrink effect has impact on the item compared to the other items with a shrink factor greater than zero.
     * Must be equal or greater than zero.
     * With a factor of `0` the item cannot shrink.
     */
    shrinkFactor?: number;
}

/**
 * Simple layout helper to organize items into rows and columns that are not necessarily need to be aligned.
 * `FlexibleLayoutItem`s can contain `FlexibleLayoutContainer` for more partitions.
 * `FlexibleLayoutItem` siblings will share all available space from the `FlexibleLayoutContainer` container.
 */
export const FlexibleLayoutItem = React.forwardRef<HTMLDivElement, FlexibleLayoutItemProps>(
    (
        {
            children,
            className = "",
            growFactor = 1,
            shrinkFactor = 0,
            style,
            ...otherDivProps
        }: FlexibleLayoutItemProps,
        ref
    ) => {
        const sizing = {} as any;
        if (typeof growFactor !== "undefined" && growFactor >= 0 && growFactor !== 1) {
            sizing[`--${eccgui}-flexible-item-grow`] = growFactor.toString(10);
        }
        if (typeof shrinkFactor !== "undefined" && shrinkFactor >= 0 && shrinkFactor !== 0) {
            sizing[`--${eccgui}-flexible-item-shrink`] = shrinkFactor.toString(10);
        }
        return (
            <div
                className={`${eccgui}-flexible__item` + (className ? " " + className : "")}
                style={{ ...(style ?? {}), ...sizing }}
                ref={ref}
                {...otherDivProps}
            >
                {children}
            </div>
        );
    }
);

export default FlexibleLayoutItem;
