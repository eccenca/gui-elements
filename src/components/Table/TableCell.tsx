import React from "react";
import {
    TableCell as CarbonTableCell,
    TableCellProps as CarbonTableCellProps,
} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TableCellProps extends CarbonTableCellProps, React.TdHTMLAttributes<HTMLTableCellElement> {
    /**
     * By default all table cell content is aligned to the top of the cell.
     * Use this property to change the vertical alignment.
     */
    alignVertical?: "middle";
}

export function TableCell({
    className = "",
    children,
    alignVertical,
    ...otherTableCellProps
}: TableCellProps) {

    return (
        <CarbonTableCell
            className={
                `${eccgui}-simpletable__cell` +
                (!!alignVertical ? ` ${eccgui}-simpletable__cell--${alignVertical}` : "") +
                (className ? ` ${className}` : "")
            }
            {...otherTableCellProps}
        >
            {children}
        </CarbonTableCell>
    ) ;
}

export default TableCell;
