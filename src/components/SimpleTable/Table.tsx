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
    ...otherCarbonTableProps
}: TableProps) {

    return (
        <CarbonTable
            className={`${eccgui}-simpletable ${eccgui}-simpletable--${size} ` + className}
            {...otherCarbonTableProps}
            size={tableRowHeightSizes[size]}
        />
    ) ;
}

export default Table;
