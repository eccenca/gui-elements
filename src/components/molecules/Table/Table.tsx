import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

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

/**
 * Table-level styling configuration shared with the descendant cell/row components.
 *
 * The density (`size`), zebra and colorless features are configured on the `<Table>` element,
 * but they style the individual cells and rows (which are separate components). They are threaded
 * down through this context instead of the former `.eccgui-simpletable--*` descendant SCSS
 * selectors; the `Table` recipe now lives entirely in the component tree (Tailwind, SCSS-free).
 *
 * When a row/cell is rendered without a surrounding `<Table>` (e.g. inside a bare `<table>`),
 * these defaults mirror the `Table` prop defaults.
 */
export interface TableStyleContextValue {
    size: TableRowHeightSize;
    colorless: boolean;
    useZebraStyles: boolean;
    hasDivider: boolean;
}

export const TableStyleContext = React.createContext<TableStyleContextValue>({
    size: "medium",
    colorless: false,
    useZebraStyles: false,
    hasDivider: true,
});

/**
 * Read the table-level styling configuration (density/zebra/colorless/divider) provided by the
 * closest `<Table>` ancestor. Falls back to the `Table` prop defaults outside a `<Table>`.
 */
export const useTableStyleContext = () => React.useContext(TableStyleContext);

/** Row kind, controls which position-based zebra selector is applied. */
type TableRowKind = "simple" | "parent";

// Position-based zebra tint. Expander rows come in `parent + child` pairs, so the parent is tinted
// every second pair (`4n+3`) and the child follows suit (`4n+4`, applied on `TableExpandedRow`);
// simple rows are tinted on every second row (`even`). The tint is intentionally subtle.
const tableZebraNthClass: Record<TableRowKind, string> = {
    simple: "even:bg-muted/30",
    parent: "[&:nth-child(4n+3)]:bg-muted/30",
};

/**
 * Shared Tailwind classes for the interactive table rows (`TableRow`, `TableExpandRow`).
 *
 * Reproduces the visual semantics of the former `--eccgui-color-cell` SCSS cascade: a subtle
 * bottom divider (when `hasDivider`), a muted hover surface, the muted "selected" surface (driven
 * by the `data-state="selected"` attribute set on the row) and the zebra tint — all suppressed
 * when the table is `colorless`.
 */
export function tableRowClasses({
    kind,
    hasDivider,
    colorless,
    tableZebra,
    rowZebra,
}: {
    kind: TableRowKind;
    hasDivider: boolean;
    colorless: boolean;
    tableZebra: boolean;
    rowZebra?: boolean;
}): string {
    return cn(
        "transition-colors",
        hasDivider && "border-b border-border",
        !colorless && "hover:bg-muted/50",
        !colorless && "data-[state=selected]:bg-muted",
        !colorless && rowZebra && "bg-muted/30",
        !colorless && tableZebra && tableZebraNthClass[kind],
    );
}

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
        <TableStyleContext.Provider
            value={{ size, colorless: !!colorless, useZebraStyles: !!useZebraStyles, hasDivider }}
        >
            <table
                className={cn(
                    `${eccgui}-simpletable ${eccgui}-simpletable--${size}`,
                    hasDivider && `${eccgui}-simpletable--rowdivider`,
                    !!colLayout && `${eccgui}-simpletable--haslayout`,
                    colorless && `${eccgui}-simpletable--colorless`,
                    useZebraStyles && `${eccgui}-simpletable--zebra`,
                    isSortable && `${eccgui}-simpletable--sort`,
                    // stock shadcn table baseline
                    "w-full min-w-full caption-bottom border-collapse text-sm",
                    // `columnWidths` requests a fixed layout so the `colgroup` widths are honoured
                    !!colLayout && "table-fixed",
                    className || undefined,
                )}
                {...otherTableProps}
            >
                {!!colLayout && colLayout}
                {children}
            </table>
        </TableStyleContext.Provider>
    );
}

export default Table;
