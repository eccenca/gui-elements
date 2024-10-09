import React from "react";
import { TableCell as CarbonTableCell } from "@carbon/react";

// import { TableCellProps as CarbonTableCellProps } from "@carbon/react/es/components/DataTable/TableCell"; // TODO: check later again, currently interface is not exported
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

// workaround to get type/interface
type CarbonTableCellProps = React.ComponentProps<typeof CarbonTableCell>;
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
