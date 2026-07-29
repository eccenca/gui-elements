import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

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
    const hasColumns = columns > 1; // FIXME: Support numbers > 2
    return (
        <ol
            {...restProps}
            className={cn(
                `${eccgui}-overviewitem__list`,
                hasDivider && `${eccgui}-overviewitem__list--hasdivider`,
                hasSpacing && `${eccgui}-overviewitem__list--hasspacing`,
                hasColumns && `${eccgui}-overviewitem__list--hascolumns`,
                hasColumns && "flex flex-row flex-wrap items-stretch",
                hasColumns && hasSpacing && "-m-1",
                className,
            )}
        >
            {React.Children.map(children, (child) => {
                return (
                    <li
                        className={cn(
                            // 2-column layout with spacing: exact half-width cells whose uniform p-1
                            // padding forms equal 8px gutters in BOTH directions (the former
                            // `odd:mr-2` extra margin made column gaps twice the row gaps); the
                            // container's -m-1 swallows the outer padding ring.
                            hasColumns && !hasSpacing && "w-[calc(50%-0.5rem)] odd:mr-2",
                            hasColumns && hasSpacing && "box-border w-1/2 p-1",
                            // 1-column layout: gap between items via padding (not `gap`, since a plain `<ol>` isn't a flex/grid box)
                            !hasColumns && hasSpacing && "pt-1 pb-1 first:pt-0 last:pb-0",
                            hasDivider && "border-b border-border last:border-b-0",
                        )}
                    >
                        {child}
                    </li>
                );
            })}
        </ol>
    );
};

export default OverviewItemList;
