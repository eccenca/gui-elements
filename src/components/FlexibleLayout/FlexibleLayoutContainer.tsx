import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface FlexibleLayoutContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Use the exact space defined by the parent element.
     * This parent element must be displayed using a fixed, relative or absolute position.
     */
    useAbsoluteSpace?: boolean;
    /**
     * If set then the container behaves similar to a row and displays its items on a horizontal axis.
     * Children could used as columns in this situation.
     */
    horizontal?: boolean;
}

/**
 * Simple layout helper to organize items into rows and columns that are not necessarily need to be aligned.
 * A `FlexibleLayoutContainer` can contain `FlexibleLayoutItem`s.
 * Do not misuse it as grid because it comes without any predefined ratios for widths and heights.
 */
export const FlexibleLayoutContainer = React.forwardRef<HTMLDivElement, FlexibleLayoutContainerProps>(
    (
        { children, className = "", useAbsoluteSpace, horizontal, ...otherDivProps }: FlexibleLayoutContainerProps,
        ref
    ) => {
        return (
            <div
                className={
                    `${eccgui}-flexible__container` +
                    (useAbsoluteSpace ? ` ${eccgui}-flexible__container--absolutespace` : "") +
                    (horizontal ? ` ${eccgui}-flexible__container--horizontal` : "") +
                    (className ? " " + className : "")
                }
                ref={ref}
                {...otherDivProps}
            >
                {children}
            </div>
        );
    }
);

export default FlexibleLayoutContainer;
