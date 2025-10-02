import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemListProps extends React.HTMLAttributes<HTMLOListElement> {
    /**
     * Add a bit white space around each of the contained items.
     */
    hasSpacing?: boolean;
    /**
     * Insert a horizontal rule between list items.
     */
    hasDivider?: boolean;
    /**
     * Use multiple columns.
     * Currently only lists using 1 and 2 columns are supported.
     */
    columns?: 1 | 2;
}

/**
 * This component is a listing container for multiple `OverviewItem` elements.
 * It should only contains `OverviewItem` children but it does not check and control that condition.
 */
export const OverviewItemList = ({
    children,
    className = "",
    hasDivider = false,
    hasSpacing = false,
    columns = 1,
    ...restProps
}: OverviewItemListProps) => {
    return (
        <ol
            {...restProps}
            className={
                `${eccgui}-overviewitem__list ` +
                (hasDivider ? `${eccgui}-overviewitem__list--hasdivider ` : "") +
                (hasSpacing ? `${eccgui}-overviewitem__list--hasspacing ` : "") +
                (columns > 1 ? `${eccgui}-overviewitem__list--hascolumns ` : "") + // FIXME: Support numbers > 2
                className
            }
        >
            {React.Children.map(children, (child) => {
                return <li>{child}</li>;
            })}
        </ol>
    );
};

export default OverviewItemList;
