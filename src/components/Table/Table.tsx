import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

type TableRowHeightSize = "small" | "medium" | "large";

/**
 * Row height token, kept for compatibility with the former Carbon `DataTable` size scale.
 */
export type DataTableSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    /**
     * Sets basically the height of a row inside the table.
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
    /**
     * Display rows with alternating background colors (position based).
     * For zebra styling of manually created rows use the `useZebraStyle` property on the row elements.
     */
    useZebraStyles?: boolean;
    /**
     * Marks the table as sortable.
     * Kept for compatibility with the former Carbon `Table` element, sorting itself is realized via the
     * `TableHeader` sorting properties (or the `TableContainer` render prop process).
     */
    isSortable?: boolean;
    /**
     * @deprecated Former Carbon experiment without effect now, kept for API compatibility.
     */
    experimentalAutoAlign?: boolean;
}

export const tableRowHeightSizes: Record<string, DataTableSize> = {
    // current values
    small: "xs",
    medium: "sm",
    large: "md",
};

export function Table({
    className = "",
    size = "medium",
    hasDivider = true,
    columnWidths,
    colorless,
    useZebraStyles,
    isSortable,
    experimentalAutoAlign, // eslint-disable-line @typescript-eslint/no-unused-vars
    children,
    ...otherTableProps
}: TableProps) {
    let colLayout: boolean | React.JSX.Element = false;
    if (!!columnWidths && columnWidths.length > 0) {
        colLayout = (
            <colgroup className={`${eccgui}-simpletable__layout`}>
                {columnWidths.map((width, i) => (
                    <col key={i} style={{ width }} />
                ))}
            </colgroup>
        );
    }

    return (
        <table
            className={cn(
                `${eccgui}-simpletable ${eccgui}-simpletable--${size}`,
                hasDivider && `${eccgui}-simpletable--rowdivider`,
                !!colLayout && `${eccgui}-simpletable--haslayout`,
                colorless && `${eccgui}-simpletable--colorless`,
                useZebraStyles && `${eccgui}-simpletable--zebra`,
                isSortable && `${eccgui}-simpletable--sort`,
                "w-full border-collapse",
                className || undefined,
            )}
            {...otherTableProps}
        >
            {!!colLayout && colLayout}
            {children}
        </table>
    );
}

export default Table;
