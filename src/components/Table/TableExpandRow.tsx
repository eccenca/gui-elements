import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import IconButton from "./../Icon/IconButton";
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
    /**
     * @deprecated Carbon-era interop property without effect, kept for API compatibility.
     */
    expandHeader?: string;
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
    expandHeader, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...otherTableExpandRowProps
}: TableExpandRowProps) {
    return (
        <tr
            className={cn(
                `${eccgui}-simpletable__row`,
                isExpanded && `${eccgui}-simpletable__row--expanded`,
                isSelected && `${eccgui}-simpletable__row--selected`,
                useZebraStyle && `${eccgui}-simpletable__row--zebra`,
                className,
            )}
            data-parent-row={true}
            {...otherTableExpandRowProps}
        >
            <TableCell className={`${eccgui}-simpletable__rowexpander`}>
                <IconButton
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
