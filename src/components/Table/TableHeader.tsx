import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from "../Icon/Icon";

/**
 * Sorting state of a (sortable) table header.
 * Mirrors the former Carbon `DataTableSortState` contract.
 */
export type DataTableSortState = "NONE" | "DESC" | "ASC";

/**
 * All supported sorting states, keyed by state name.
 */
export const sortStates: Record<DataTableSortState, DataTableSortState> = {
    NONE: "NONE",
    DESC: "DESC",
    ASC: "ASC",
};

const ariaSortStates: Record<DataTableSortState, React.AriaAttributes["aria-sort"]> = {
    NONE: "none",
    ASC: "ascending",
    DESC: "descending",
};

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableCellElement & HTMLButtonElement> {
    /**
     * Pass in children that will be embedded in the table header label.
     */
    children?: React.ReactNode;
    /**
     * Specify an optional className to be applied to the container node.
     */
    className?: string;
    /**
     * Specify `colSpan` as a non-negative integer value to indicate how
     * many columns the header cell extends in a table.
     */
    colSpan?: number;
    /**
     * Supply an id to the `th` element.
     */
    id?: string;
    /**
     * Specify whether this header is the header by which a table is being sorted by.
     */
    isSortHeader?: boolean;
    /**
     * Specify whether this header is one through which a user can sort the table.
     */
    isSortable?: boolean;
    /**
     * Hook that is invoked when the header is clicked.
     */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    /**
     * Specify the scope of this table header.
     * You can find more info about this attribute at the following URL:
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-scope
     */
    scope?: string;
    /**
     * Specify which direction we are currently sorting by, should be one of `DESC`, `NONE` or `ASC`.
     */
    sortDirection?: DataTableSortState;
}

/**
 * Header cell of the table.
 * Can display a sorting control managed via the `isSortable`, `isSortHeader`, `sortDirection`
 * and `onClick` properties.
 */
export const TableHeader = React.forwardRef<HTMLTableCellElement, TableHeaderProps>(function TableHeader(
    {
        className,
        children,
        colSpan,
        id,
        isSortHeader,
        isSortable = false,
        onClick,
        scope = "col",
        sortDirection,
        ...otherHeaderProps
    }: TableHeaderProps,
    ref,
) {
    if (!isSortable) {
        return (
            <th
                {...otherHeaderProps}
                id={id}
                className={cn(`${eccgui}-simpletable__header`, "text-left align-middle", className)}
                scope={scope}
                colSpan={colSpan}
                ref={ref}
            >
                {children ? <div className={`${eccgui}-simpletable__header-label`}>{children}</div> : null}
            </th>
        );
    }

    const isSortedActively = !!isSortHeader && !!sortDirection && sortDirection !== sortStates.NONE;
    const ariaSort = !isSortHeader || !sortDirection ? "none" : ariaSortStates[sortDirection];
    const sortIcon = isSortedActively
        ? sortDirection === sortStates.DESC
            ? "list-sortdesc"
            : "list-sortasc"
        : "list-sort";

    return (
        <th
            id={id}
            aria-sort={ariaSort}
            className={cn(
                `${eccgui}-simpletable__header ${eccgui}-simpletable__header--sortable`,
                "text-left align-middle",
                className,
            )}
            colSpan={colSpan}
            ref={ref}
            scope={scope}
        >
            <button
                type="button"
                className={cn(
                    `${eccgui}-simpletable__sort`,
                    isSortedActively && `${eccgui}-simpletable__sort--active`,
                    !!isSortHeader && sortDirection === sortStates.DESC && `${eccgui}-simpletable__sort--descending`,
                    className,
                )}
                onClick={onClick}
                {...otherHeaderProps}
            >
                <span className={`${eccgui}-simpletable__sort-flex`}>
                    <div className={`${eccgui}-simpletable__header-label`}>{children}</div>
                    <Icon
                        name={sortIcon}
                        className={cn(
                            `${eccgui}-simpletable__sort-icon`,
                            !isSortedActively && `${eccgui}-simpletable__sort-icon--unsorted`,
                        )}
                        small
                    />
                </span>
            </button>
        </th>
    );
});

export default TableHeader;
