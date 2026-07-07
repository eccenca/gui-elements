import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { TableProps } from "./Table";
import { DataTableSortState, sortStates } from "./TableHeader";

/**
 * Definition of a table header (column) processed by the data table process of `TableContainer`.
 */
export interface DataTableHeader {
    /**
     * Unique key of the column, used to pick the cell value from each row object.
     */
    key: string;
    /**
     * Label displayed inside the header cell.
     */
    header: React.ReactNode;
    /**
     * Allow sorting by this column.
     */
    isSortable?: boolean;
}

/**
 * Minimal shape of a data table row object.
 * Beside `id` a row usually contains the cell values, keyed by the header (column) keys.
 */
export interface DataTableRow {
    id: string;
    disabled?: boolean;
    isExpanded?: boolean;
    isSelected?: boolean;
}

interface SortRowOptions {
    key: string;
    sortDirection: DataTableSortState;
    sortStates: Record<DataTableSortState, DataTableSortState>;
    locale: string;
    compare: (a: unknown, b: unknown, locale?: string) => number;
}

/**
 * Render properties handed over to the children render function of a `TableContainer` that
 * is used with `rows` and `headers` properties (data table mode).
 * Mirrors the parts of the former Carbon `DataTableRenderProps` contract that are supported.
 */
// The second type parameter mirrors the former Carbon `DataTableRenderProps<RowType, ColTypes>`
// signature (column value types); it is unused here but kept so existing type annotations
// like `DataTableRenderProps<any, any>` stay valid.
export interface DataTableRenderProps<RowType = any, _ColTypes extends any[] = any[]> {
    /**
     * The normalized headers for the table.
     */
    headers: DataTableHeader[];
    /**
     * The rows of the table, sorted according to the current sorting state.
     */
    rows: (DataTableRow & RowType)[];
    /**
     * Prop getter for `TableHeader` elements, wires up the sorting state and click handling.
     */
    getHeaderProps: (options: {
        header: DataTableHeader;
        isSortable?: boolean;
        onClick?: (
            event: React.MouseEvent<HTMLButtonElement>,
            sortState: { sortHeaderKey: string; sortDirection: DataTableSortState },
        ) => void;
        [key: string]: unknown;
    }) => {
        isSortable: boolean | undefined;
        isSortHeader: boolean;
        key: string;
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
        sortDirection: DataTableSortState;
        [key: string]: unknown;
    };
    /**
     * Prop getter for row elements, forwards the (expansion) state of the row.
     */
    getRowProps: (options: { row: DataTableRow & RowType; [key: string]: unknown }) => {
        key: string;
        isExpanded: boolean;
        isSelected: boolean | undefined;
        onExpand: (event: React.MouseEvent<HTMLButtonElement>) => void;
        [key: string]: unknown;
    };
    /**
     * Prop getter for the `Table` element.
     */
    getTableProps: () => Pick<TableProps, "size" | "useZebraStyles" | "isSortable">;
    /**
     * Prop getter for a manually rendered `TableContainer` element.
     */
    getTableContainerProps: () => Record<string, never>;
    /**
     * Sorts the table by a specific header (cycling through ascending, descending and unsorted).
     */
    sortBy: (headerKey: string) => void;
    /**
     * Expands or collapses a specific row.
     */
    expandRow: (rowId: string) => void;
    /**
     * Expands or collapses all rows.
     */
    expandAll: () => void;
}

export interface TableDataContainerProps extends Omit<React.TableHTMLAttributes<HTMLTableElement>, "children"> {
    /**
     * The data rows of the table.
     * Each row object needs a unique `id` and usually carries the cell values keyed by the header keys.
     */
    rows: DataTableRow[];
    /**
     * The (column) headers of the table.
     */
    headers: DataTableHeader[];
    /**
     * Render function receiving the `DataTableRenderProps` contract.
     */
    children(signature: any): React.JSX.Element;
    /**
     * Sets basically the height of a row inside the table.
     */
    size?: TableProps["size"];
    /**
     * Allow sorting for all table headers by default.
     */
    isSortable?: boolean;
    /**
     * Display rows with alternating background colors.
     */
    useZebraStyles?: boolean;
    /**
     * Locale used by the default sorting comparator.
     */
    locale?: string;
    /**
     * Custom comparator used to sort two cell values.
     */
    sortRow?: (cellA: any, cellB: any, options: SortRowOptions) => number;
}

export interface TableSimpleContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.JSX.Element;
}

export type TableContainerProps = TableDataContainerProps | TableSimpleContainerProps;

/**
 * Default comparator, mirrors the former Carbon behavior: numbers are compared
 * numerically, everything else is compared as (locale-aware) strings.
 */
const compare = (a: unknown, b: unknown, locale = "en"): number => {
    if (typeof a === "number" && typeof b === "number") {
        return a - b;
    }
    return String(a ?? "").localeCompare(String(b ?? ""), locale, { numeric: true });
};

interface SortState {
    key: string | null;
    direction: DataTableSortState;
}

/**
 * Cycle the sorting state: a new header always starts with `ASC`,
 * repeated activation of the same header cycles `ASC` -> `DESC` -> `NONE`.
 */
const getNextSortState = (current: SortState, headerKey: string): SortState => {
    if (current.key !== headerKey) {
        return { key: headerKey, direction: sortStates.ASC };
    }
    switch (current.direction) {
        case sortStates.NONE:
            return { key: headerKey, direction: sortStates.ASC };
        case sortStates.ASC:
            return { key: headerKey, direction: sortStates.DESC };
        default:
            return { key: headerKey, direction: sortStates.NONE };
    }
};

/**
 * Headless engine providing the (former Carbon) data table render prop contract.
 */
function DataTableEngine({
    rows,
    headers,
    children,
    size,
    isSortable,
    useZebraStyles,
    locale = "en",
    sortRow,
}: TableDataContainerProps) {
    const [sort, setSort] = React.useState<SortState>({ key: null, direction: sortStates.NONE });
    const [expandedRows, setExpandedRows] = React.useState<ReadonlySet<string>>(new Set());
    const { key: sortHeaderKey, direction: sortDirection } = sort;

    const sortBy = (headerKey: string): SortState => {
        const next = getNextSortState(sort, headerKey);
        setSort(next);
        return next;
    };

    const expandRow = React.useCallback((rowId: string) => {
        setExpandedRows((previous) => {
            const next = new Set(previous);
            if (next.has(rowId)) {
                next.delete(rowId);
            } else {
                next.add(rowId);
            }
            return next;
        });
    }, []);

    const expandAll = React.useCallback(() => {
        setExpandedRows((previous) => (previous.size >= rows.length ? new Set() : new Set(rows.map((r) => r.id))));
    }, [rows]);

    const sortedRows = React.useMemo(() => {
        if (!sortHeaderKey || sortDirection === sortStates.NONE) {
            return rows;
        }
        const comparatorOptions: SortRowOptions = {
            key: sortHeaderKey,
            sortDirection,
            sortStates,
            locale,
            compare,
        };
        return [...rows].sort((rowA, rowB) => {
            const cellA = (rowA as Record<string, any>)[sortHeaderKey];
            const cellB = (rowB as Record<string, any>)[sortHeaderKey];
            if (sortRow) {
                return sortRow(cellA, cellB, comparatorOptions);
            }
            return sortDirection === sortStates.ASC ? compare(cellA, cellB, locale) : compare(cellB, cellA, locale);
        });
    }, [rows, sortHeaderKey, sortDirection, locale, sortRow]);

    const renderProps: DataTableRenderProps = {
        headers,
        rows: sortedRows.map((row) => ({
            ...row,
            isExpanded: expandedRows.has(row.id) || !!row.isExpanded,
        })),
        getHeaderProps: ({ header, onClick, isSortable: headerIsSortable, ...rest }) => ({
            ...rest,
            key: header.key,
            sortDirection,
            isSortable: headerIsSortable ?? header.isSortable ?? isSortable,
            isSortHeader: sortHeaderKey === header.key,
            onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                const next = sortBy(header.key);
                onClick?.(event, { sortHeaderKey: header.key, sortDirection: next.direction });
            },
        }),
        getRowProps: ({ row, ...rest }) => ({
            ...rest,
            key: row.id,
            isExpanded: expandedRows.has(row.id) || !!row.isExpanded,
            isSelected: row.isSelected,
            onExpand: () => expandRow(row.id),
        }),
        getTableProps: () => ({
            size: size ?? "medium",
            useZebraStyles,
            isSortable,
        }),
        getTableContainerProps: () => ({}),
        sortBy,
        expandRow,
        expandAll,
    };

    return children(renderProps);
}

export function TableContainer({ className = "", ...otherProps }: TableContainerProps) {
    const dataTableProps = otherProps as TableDataContainerProps;

    return !!dataTableProps.headers || !!dataTableProps.rows ? (
        <div className={cn(`${eccgui}-simpletable__container`, className || undefined)}>
            <DataTableEngine {...dataTableProps} size={dataTableProps.size ?? "medium"} />
        </div>
    ) : (
        <div
            {...(otherProps as TableSimpleContainerProps)}
            className={cn(`${eccgui}-simpletable__container`, className || undefined)}
        />
    );
}

export default TableContainer;
