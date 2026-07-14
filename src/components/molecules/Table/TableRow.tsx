import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import { tableRowClasses, useTableStyleContext } from "./Table";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    /**
     * Display this row with the styles from a zebra style-enabled table.
     */
    useZebraStyle?: boolean;
    /**
     * Display this row with "selected" styles.
     */
    isSelected?: boolean;
}

export function TableRow({
    className = "",
    children,
    useZebraStyle,
    isSelected,
    ...otherTableRowProps
}: TableRowProps) {
    const { colorless, useZebraStyles: tableZebra, hasDivider } = useTableStyleContext();
    return (
        <tr
            className={cn(
                `${eccgui}-simpletable__row`,
                useZebraStyle && `${eccgui}-simpletable__row--zebra`,
                isSelected && `${eccgui}-simpletable__row--selected`,
                tableRowClasses({ kind: "simple", hasDivider, colorless, tableZebra, rowZebra: useZebraStyle }),
                className || undefined,
            )}
            data-state={!colorless && isSelected ? "selected" : undefined}
            aria-selected={isSelected ? true : undefined}
            {...otherTableRowProps}
        >
            {children}
        </tr>
    );
}

export default TableRow;
