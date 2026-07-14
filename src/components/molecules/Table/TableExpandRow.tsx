import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import IconButton from "@/components/atoms/Icon/IconButton";
import { tableRowClasses, useTableStyleContext } from "./Table";
import TableCell from "./TableCell";

export interface TableExpandRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    /**
     * This text is displayed as tooltip for the button that toggles the expanded/collapsed state.
     */
    togglerText: string;
    /**
     * Display this row with the styles from a zebra style-enabled table.
     */
    useZebraStyle?: boolean;
    /**
     * Current expansion state of the row.
     * The connected `TableExpandedRow` element (the direct sibling of this row) is only displayed if this is `true`.
     */
    isExpanded?: boolean;
    /**
     * Display this row with "selected" styles.
     */
    isSelected?: boolean;
    /**
     * Callback invoked when the expand/collapse toggler button is clicked.
     */
    onExpand: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Table row that is prefixed by a cell containing a button to expand/collapse this row.
 */
export function TableExpandRow({
    togglerText,
    isExpanded,
    isSelected,
    useZebraStyle,
    onExpand,
    className,
    children,
    ...otherTableExpandRowProps
}: TableExpandRowProps) {
    const { colorless, useZebraStyles: tableZebra, hasDivider } = useTableStyleContext();
    return (
        <tr
            className={cn(
                `${eccgui}-simpletable__row`,
                isExpanded && `${eccgui}-simpletable__row--expanded`,
                isSelected && `${eccgui}-simpletable__row--selected`,
                useZebraStyle && `${eccgui}-simpletable__row--zebra`,
                tableRowClasses({ kind: "parent", hasDivider, colorless, tableZebra, rowZebra: useZebraStyle }),
                // The connected `TableExpandedRow` (the adjacent sibling) is only revealed while this
                // parent row is expanded — ports the former `+ tr[data-child-row] { display: none }`
                // SCSS toggle. Driven from the parent (which knows `isExpanded`) so the child stays
                // visible when rendered without a preceding parent row.
                !isExpanded && "[&+tr[data-child-row]]:hidden",
                // manual zebra tints the connected child row as well
                !colorless && useZebraStyle && "[&+tr[data-child-row]]:bg-muted/30",
                className,
            )}
            data-parent-row={true}
            data-state={!colorless && isSelected ? "selected" : undefined}
            {...otherTableExpandRowProps}
        >
            <TableCell className={cn(`${eccgui}-simpletable__rowexpander`, "w-8 p-0 text-center align-middle")}>
                <IconButton
                    size="small"
                    name={isExpanded ? "toggler-showless" : "toggler-showmore"}
                    text={togglerText}
                    // cast: `IconButton` is polymorphic (button/anchor) but renders a plain button here
                    onClick={
                        onExpand as React.MouseEventHandler<HTMLButtonElement> &
                            React.MouseEventHandler<HTMLAnchorElement>
                    }
                    aria-expanded={!!isExpanded}
                />
            </TableCell>
            {children}
        </tr>
    );
}

export default TableExpandRow;
