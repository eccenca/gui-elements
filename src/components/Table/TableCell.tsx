import React from "react";
import { TableCell as CarbonTableCell, TableCellProps as CarbonTableCellProps } from "carbon-components-react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TableCellProps extends CarbonTableCellProps, React.TdHTMLAttributes<HTMLTableCellElement> {
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
        <CarbonTableCell
            className={
                `${eccgui}-simpletable__cell` +
                (alignHorizontal ? ` ${eccgui}-simpletable__cell--${alignHorizontal}` : "") +
                (alignVertical ? ` ${eccgui}-simpletable__cell--${alignVertical}` : "") +
                (className ? ` ${className}` : "")
            }
            {...otherTableCellProps}
        >
            {children}
        </CarbonTableCell>
    );
}

export default TableCell;
