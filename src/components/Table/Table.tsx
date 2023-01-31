import React from "react";
import {
    Table as CarbonTable,
    TableProps as CarbonTableProps,
    DataTableSize as CarbonDataTableSize,
} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

type TableRowHeightSizeDepracted = "compact" | "tall"; // @deprecated
export type TableRowHeightSize = "small" | "medium" | "large" | TableRowHeightSizeDepracted;

export interface TableProps extends Omit<
    CarbonTableProps,
    "size" | "overflowMenuOnHover" | "stickyHeader" | "useStaticWidth"
>, React.TableHTMLAttributes<HTMLTableElement> {
    /**
     * Sets basically the height of a row inside the table.
     * Please use only `small`, `medium` and `large`.
     * `compact` and `tall` are deprecated.
     */
    size?: TableRowHeightSize;
    /**
     * All rows are divided by horizontal borders.
     */
    hasDivider?: boolean;
}

export const tableRowHeightSizes: Record<string, CarbonDataTableSize> = {
    // current values
    "small": "xs",
    "medium": "sm",
    "large": "md",
    // deprecated values
    "compact": "xs",
    "tall": "md",
}

function Table({
    className = "",
    size = "medium",
    hasDivider = true,
    ...otherCarbonTableProps
}: TableProps) {

    return (
        <CarbonTable
            className={
                `${eccgui}-simpletable ${eccgui}-simpletable--${size}` +
                (hasDivider ? ` ${eccgui}-simpletable--rowdivider` : "") +
                (className ? ` ${className}` : "")
            }
            {...otherCarbonTableProps}
            size={tableRowHeightSizes[size]}
        />
    ) ;
}

export default Table;
