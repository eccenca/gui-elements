import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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

export function TableCell({
    className = "",
    children,
    alignHorizontal,
    alignVertical,
    ...otherTableCellProps
}: TableCellProps) {
    return (
        <td
            className={cn(
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
