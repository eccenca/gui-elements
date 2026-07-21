import React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/common/utils/cn";
import Icon from "@/components/atoms/Icon/Icon";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import { useTableStyleContext } from "./Table";

/**
 * Sorting state of a (sortable) table header.
 * Mirrors the former Carbon `DataTableSortState` contract.
 */
export type DataTableSortState = "NONE" | "DESC" | "ASC";

/**
 * Header cell recipe: the vendored shadcn header cell (`px-2 text-left align-middle font-medium
 * text-foreground`) with no background fill, so the header reads as plain text over the
 * body's top divider — the default shadcn table look. The height follows the table density
 * (`size`, read from the table-level context). A consumer that makes the header sticky
 * (`sticky top-0 z-10`) must add its own opaque `bg-*` so the body doesn't show through.
 */
const tableHeaderVariants = cva("px-2 text-left align-middle text-sm font-medium text-foreground", {
    variants: {
        size: {
            small: "h-8",
            medium: "h-9",
            large: "h-12",
        },
    },
    defaultVariants: {
        size: "medium",
    },
});

/** Minimum height of the full-cell sort button, matching the header height per density. */
const sortButtonMinHeight: Record<"small" | "medium" | "large", string> = {
    small: "min-h-8",
    medium: "min-h-9",
    large: "min-h-12",
};

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
    const { size } = useTableStyleContext();
    if (!isSortable) {
        return (
            <th
                {...otherHeaderProps}
                id={id}
                className={cn(tableHeaderVariants({ size }), `${eccgui}-simpletable__header`, className)}
                scope={scope}
                colSpan={colSpan}
                ref={ref}
            >
                {children ? (
                    <div className={cn(`${eccgui}-simpletable__header-label`, "min-w-0 overflow-hidden")}>
                        {children}
                    </div>
                ) : null}
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
                tableHeaderVariants({ size }),
                // the full-cell button owns the padding of a sortable header
                "p-0",
                `${eccgui}-simpletable__header ${eccgui}-simpletable__header--sortable`,
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
                    "flex h-full w-full cursor-pointer appearance-none items-center gap-1 border-0 bg-transparent px-2 text-left font-medium text-foreground outline-none",
                    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    sortButtonMinHeight[size],
                    "hover:bg-muted-foreground/10",
                    isSortedActively && "bg-muted-foreground/15",
                    className,
                )}
                onClick={onClick}
                {...otherHeaderProps}
            >
                <span className={cn(`${eccgui}-simpletable__sort-flex`, "flex w-full items-center")}>
                    <div className={cn(`${eccgui}-simpletable__header-label`, "min-w-0 flex-1 overflow-hidden")}>
                        {children}
                    </div>
                    <Icon
                        name={sortIcon}
                        className={cn(
                            `${eccgui}-simpletable__sort-icon`,
                            !isSortedActively && `${eccgui}-simpletable__sort-icon--unsorted`,
                            "mx-1 shrink-0",
                        )}
                        small
                    />
                </span>
            </button>
        </th>
    );
});

export default TableHeader;
