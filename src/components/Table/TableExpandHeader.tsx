import React from "react";
import {
    TableExpandHeader as CarbonTableExpandHeader,
    TableExpandHeaderProps as CarbonTableExpandHeaderProps,
} from "carbon-components-react";
import IconButton from "./../Icon/IconButton";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TableExpandHeaderProps extends Omit<
    CarbonTableExpandHeaderProps,
    "children" | "ariaLabel" | "enableExpando" | "expandIconDescription"
>, React.ThHTMLAttributes<HTMLTableCellElement> {
    /**
     * This text is displayed as tooltip for the button that toggles the expanded/collapsed state.
     */
    togglerText: string;
};

/**
 * Adds a button to the table header that can trigger a function to expand/collapse all rows of the table.
 */
export function TableExpandHeader ({
    togglerText,
    isExpanded,
    onExpand,
    className,
    enableToggle,
    ...otherCarbonTableExpandHeaderProps
}: TableExpandHeaderProps) {

    const toggleButton = isExpanded ?
        React.cloneElement(<IconButton name="toggler-rowcollapse" text={togglerText} />, {onClick: onExpand}) :
        React.cloneElement(<IconButton name="toggler-rowexpand" text={togglerText} />, {onClick: onExpand});

    return (
        <CarbonTableExpandHeader
            className={
                `${eccgui}-simpletable__headexpander` +
                (!!className ? ` ${className}` : "")
            }
            isExpanded={isExpanded}
            onExpand={onExpand}
            enableToggle={false}
            {...otherCarbonTableExpandHeaderProps}
        >
            { enableToggle && toggleButton }
        </CarbonTableExpandHeader>
    )
}

export default TableExpandHeader;
