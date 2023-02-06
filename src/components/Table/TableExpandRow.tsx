import React from "react";
import {
    TableExpandRowProps as CarbonTableExpandRowProps,
} from "carbon-components-react";
import {usePrefix as carbonPrefix} from "carbon-components-react/es/index"
import IconButton from "./../Icon/IconButton";
import { TableCell } from "./index";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TableExpandRowProps extends Omit<
    CarbonTableExpandRowProps,
    "ariaLabel" | "expandIconDescription"
>, React.HTMLAttributes<HTMLTableRowElement> {
    /**
     * This text is displayed as tooltip for the button that toggles the expanded/collapsed state.
     */
    togglerText: string;
};

/**
 * Table row that is suffixed by a cell containing a button to expand/collapse this row.
 */
function TableExpandRow ({
    togglerText,
    isExpanded,
    isSelected,
    onExpand,
    className,
    children,
    ...otherCarbonTableExpandRowProps
}: TableExpandRowProps) {

    const carbonClassPrefix = carbonPrefix();

    const toggleButton = isExpanded ?
        React.cloneElement(<IconButton name="toggler-showless" text={togglerText} />, {onClick: onExpand}) :
        React.cloneElement(<IconButton name="toggler-showmore" text={togglerText} />, {onClick: onExpand});

    return (
        <tr
            className={
                `${eccgui}-simpletable__row` +
                ` ${carbonClassPrefix}--parent-row` +
                (isExpanded ? ` ${carbonClassPrefix}--expandable-row` : "") +
                (isSelected ? ` ${carbonClassPrefix}--data-table--selected` : "") +
                (!!className ? ` ${carbonClassPrefix}` : "")
            }
            data-parent-row={true}
            {...otherCarbonTableExpandRowProps}
        >
            <TableCell
                className={
                    `${eccgui}-simpletable__rowexpander` +
                    ` ${carbonClassPrefix}--table-expand`
                }
            >
                { toggleButton }
            </TableCell>
            { children }
        </tr>
    )
}

export default TableExpandRow;
