import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TableExpandedRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    /**
     * The number of table columns this (single cell) row should span.
     */
    colSpan: number;
}

/**
 * Row displaying the extended content connected to a `TableExpandRow`.
 * It must be placed as the direct sibling after the `TableExpandRow` element it belongs to.
 * It is only displayed when the connected `TableExpandRow` is marked as expanded
 * (or when it is rendered without a preceding parent row).
 */
export function TableExpandedRow({
    className = "",
    children,
    colSpan,
    ...otherTableExpandedRowProps
}: TableExpandedRowProps) {
    return (
        <tr
            {...otherTableExpandedRowProps}
            className={cn(`${eccgui}-simpletable__expandedrow`, className || undefined)}
            data-child-row={true}
        >
            <td colSpan={colSpan}>{children}</td>
        </tr>
    );
}

export default TableExpandedRow;
