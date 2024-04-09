import React, { forwardRef } from "react"; // @see https://github.com/storybookjs/storybook/issues/8881#issuecomment-831937051

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
    /**
     * If true the used amount of space for each item is related to the amout of its content compared to each other.
     * Otherwise the items use equal amounts as long this is possible.
     */
    noEqualItemSpace?: boolean;
}

/**
 * Simple layout helper to organize items into rows and columns that are not necessarily need to be aligned.
 * A `FlexibleLayoutContainer` can contain `FlexibleLayoutItem`s.
 * Do not misuse it as grid because it comes without any predefined ratios for widths and heights.
 */
export const FlexibleLayoutContainer = forwardRef<HTMLDivElement, FlexibleLayoutContainerProps>(
    (
        {
            children,
            className = "",
            useAbsoluteSpace,
            horizontal,
            noEqualItemSpace,
            ...otherDivProps
        }: FlexibleLayoutContainerProps,
        ref
    ) => {
        return (
            <div
                className={
                    `${eccgui}-flexible__container` +
                    (useAbsoluteSpace ? ` ${eccgui}-flexible__container--absolutespace` : "") +
                    (horizontal ? ` ${eccgui}-flexible__container--horizontal` : "") +
                    (noEqualItemSpace ? ` ${eccgui}-flexible__container--notequalitemspace` : "") +
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
