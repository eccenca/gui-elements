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
    /**
     * This will lead to a `colgroup` element within the `table` setting `with` styles for each column.
     * The table is then displayed `fixed`.
     * All values need to be valid CSS width expression, e.g. `30px`, `5rem`, `40%`.
     * If you need to add more attributes to the `col` elements, e.g. class names, then you need to control `colgroup` and `fixed` table by yourself.
     */
    columnWidths?: string[];
    /**
     * Table is displayed without any own coloring.
     * For example this can be used for sub tables inside other elements with already set background colors.
     * Zebra styles won't work if this option is enabled!
     */
    colorless?: boolean;
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
    columnWidths,
    colorless,
    children,
    ...otherCarbonTableProps
}: TableProps) {

    let colLayout : boolean | JSX.Element = false;
    if (!!columnWidths && columnWidths.length > 0) {
        colLayout = (
            <colgroup className={`${eccgui}-simpletable__layout`}>
                {columnWidths.map(width => <col style={{ width }}/>)}
            </colgroup>
        );
    }

    return (
        <CarbonTable
            className={
                `${eccgui}-simpletable ${eccgui}-simpletable--${size}` +
                (hasDivider ? ` ${eccgui}-simpletable--rowdivider` : "") +
                (colLayout ? ` ${eccgui}-simpletable--haslayout` : "") +
                (colorless ? ` ${eccgui}-simpletable--colorless` : "") +
                (className ? ` ${className}` : "")
            }
            {...otherCarbonTableProps}
            size={tableRowHeightSizes[size]}
        >
            {!!colLayout && colLayout}
            {children}
        </CarbonTable>
    ) ;
}

export default Table;
