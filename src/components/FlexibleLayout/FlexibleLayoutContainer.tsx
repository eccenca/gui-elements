import React, { forwardRef } from "react"; // @see https://github.com/storybookjs/storybook/issues/8881#issuecomment-831937051

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { DividerProps } from "./../Separation/Divider";

export interface FlexibleLayoutContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Use the exact space defined by the parent element.
     * This parent element must be displayed using a fixed, relative or absolute position.
     */
    useAbsoluteSpace?: boolean;
    /**
     * If set then the container behaves similar to a column and displays its items on a vertical axis.
     * Children could used as rows in this situation.
     */
    vertical?: boolean;
    /**
     * If true the used amount of space for each item is related to the amout of its content compared to each other.
     * Otherwise the items use equal amounts as long this is possible.
     */
    noEqualItemSpace?: boolean;
    /**
     * Quick way to add whitespace between container children.
     * For more complex usecases like dividers you need to use extra `<FlexibleLayoutItem/>` components in combination with `<Divider/>` components.
     */
    gapSize?: DividerProps["addSpacing"];
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
            vertical,
            noEqualItemSpace,
            gapSize = "none",
            ...otherDivProps
        }: FlexibleLayoutContainerProps,
        ref
    ) => {
        return (
            <div
                className={
                    `${eccgui}-flexible__container` +
                    (useAbsoluteSpace ? ` ${eccgui}-flexible__container--absolutespace` : "") +
                    (vertical ? ` ${eccgui}-flexible__container--vertical` : "") +
                    (noEqualItemSpace ? ` ${eccgui}-flexible__container--notequalitemspace` : "") +
                    (gapSize !== "none" ? ` ${eccgui}-flexible__container--gap-${gapSize}` : "") +
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
