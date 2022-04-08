import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemListProps extends React.HTMLAttributes<HTMLOListElement> {
    /**
     * Displays the element using reduced height and less white space inside.
     */
    densityHigh?: boolean;
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
    columns?: number;
}

/**
 * This element can include all basic information and actions to give an overview about the item.
 * Mainly used in items list or to create basic widgets.
 */
function OverviewItemList({
    children,
    className = '',
    densityHigh = false,
    hasDivider = false,
    hasSpacing = false,
    columns=1,
    ...restProps
}: OverviewItemListProps) {
    return (
        <ol
            {...restProps}
            className={
                `${eccgui}-overviewitem__list ` +
                (densityHigh ? `${eccgui}-overviewitem__list--highdensity ` : '') +
                (hasDivider ? `${eccgui}-overviewitem__list--hasdivider ` : '') +
                (hasSpacing ? `${eccgui}-overviewitem__list--hasspacing ` : '') +
                (columns > 1 ? `${eccgui}-overviewitem__list--hascolumns ` : '') + // TODO: add number
                className
            }
        >
            {
                React.Children.map(children, (child, i) => {
                    return <li>{ child }</li>
                })
            }
        </ol>
    )
}

export default OverviewItemList;
