import React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { useTableStyleContext } from "./Table";

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    /**
     * By default all table cell content is aligned to the left of the cell.
     * Use this property to change the horizontal alignment.
     */
    alignHorizontal?: "left" | "center";
    /**
     * By default all table cell content is aligned to the top of the cell.
     * Use this property to change the vertical alignment.
     */
    alignVertical?: "top" | "middle";
}

/**
 * Body cell recipe. The density (`size`) axis mirrors the stock shadcn `p-2` cell padding for the
 * regular size and the compact/tall variants of the former Carbon size scale; it is read from the
 * table-level context because the `size` is configured on the `<Table>` element.
 */
export const tableCellVariants = cva("", {
    variants: {
        size: {
            small: "px-2 py-1",
            medium: "px-2 py-1.5",
            large: "px-2 py-3",
        },
        alignVertical: {
            top: "align-top",
            middle: "align-middle",
        },
        alignHorizontal: {
            left: "text-left",
            center: "text-center",
        },
    },
    defaultVariants: {
        size: "medium",
        alignVertical: "top",
        alignHorizontal: "left",
    },
});

export function TableCell({
    className = "",
    children,
    alignHorizontal,
    alignVertical,
    ...otherTableCellProps
}: TableCellProps) {
    const { size } = useTableStyleContext();
    return (
        <td
            className={cn(
                tableCellVariants({ size, alignVertical, alignHorizontal }),
                `${eccgui}-simpletable__cell`,
                alignHorizontal && `${eccgui}-simpletable__cell--${alignHorizontal}`,
                alignVertical && `${eccgui}-simpletable__cell--${alignVertical}`,
                className || undefined,
            )}
            {...otherTableCellProps}
        >
            {children}
        </td>
    );
}

export default TableCell;
