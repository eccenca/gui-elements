import React from "react";
import { TableExpandRow as CarbonTableExpandRow } from "@carbon/react";
// import { TableExpandRowProps as CarbonTableExpandRowProps } from "@carbon/react/es/components/DataTable/TableExpandRow"; // TODO: check later again, currently interface is not exported
import { usePrefix as carbonPrefix } from "@carbon/react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import IconButton from "./../Icon/IconButton";
import { TableCell } from "./index";

// workaround to get type/interface
type CarbonTableExpandRowProps = React.ComponentProps<typeof CarbonTableExpandRow>;
export interface TableExpandRowProps
    extends Omit<CarbonTableExpandRowProps, "ref" | "ariaLabel" | "expandIconDescription">,
        Omit<React.HTMLAttributes<HTMLTableRowElement>, "aria-label"> {
    /**
     * This text is displayed as tooltip for the button that toggles the expanded/collapsed state.
     */
    togglerText: string;
    /**
     * Display this row with the styles from a zebra style-enabled table.
     */
    useZebraStyle?: boolean;
}

/**
 * Table row that is suffixed by a cell containing a button to expand/collapse this row.
 */
export function TableExpandRow({
    togglerText,
    isExpanded,
    isSelected,
    useZebraStyle,
    onExpand,
    className,
    children,
    ...otherCarbonTableExpandRowProps
}: TableExpandRowProps) {
    const carbonClassPrefix = carbonPrefix();

    const toggleButton = isExpanded
        ? React.cloneElement(<IconButton name="toggler-showless" text={togglerText} />, { onClick: onExpand })
        : React.cloneElement(<IconButton name="toggler-showmore" text={togglerText} />, { onClick: onExpand });

    return (
        <tr
            className={
                `${eccgui}-simpletable__row` +
                ` ${carbonClassPrefix}--parent-row` +
                (isExpanded ? ` ${carbonClassPrefix}--expandable-row` : "") +
                (isSelected ? ` ${carbonClassPrefix}--data-table--selected` : "") +
                (useZebraStyle ? ` ${eccgui}-simpletable__row--zebra` : "") +
                (className ? ` ${className}` : "")
            }
            data-parent-row={true}
            {...otherCarbonTableExpandRowProps}
        >
            <TableCell className={`${eccgui}-simpletable__rowexpander` + ` ${carbonClassPrefix}--table-expand`}>
                {toggleButton}
            </TableCell>
            {children}
        </tr>
    );
}

export default TableExpandRow;
