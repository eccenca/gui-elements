import React from "react";
import {
    TableExpandHeader as CarbonTableExpandHeader,
    TableExpandHeaderProps as CarbonTableExpandHeaderProps,
} from "carbon-components-react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestIconProps } from "../Icon";
import { ValidIconName } from "../Icon/canonicalIconNames";

import IconButton from "./../Icon/IconButton";

export interface TableExpandHeaderProps
    extends Omit<CarbonTableExpandHeaderProps, "children" | "ariaLabel" | "enableExpando" | "expandIconDescription">,
        React.ThHTMLAttributes<HTMLTableCellElement> {
    /**
     * This text is displayed as tooltip for the button that toggles the expanded/collapsed state.
     */
    togglerText: string;

    /** An optional icon that is shown as toggle icon. */
    toggleIcon?: ValidIconName | string[] | React.ReactElement<TestIconProps>;
}

/**
 * Adds a button to the table header that can trigger a function to expand/collapse all rows of the table.
 */
export function TableExpandHeader({
    togglerText,
    isExpanded,
    onExpand,
    className,
    enableToggle,
    toggleIcon,
    ...otherCarbonTableExpandHeaderProps
}: TableExpandHeaderProps) {
    const defaultToggleIcon = isExpanded ? "toggler-rowcollapse" : "toggler-rowexpand";
    const toggleButton = React.cloneElement(<IconButton name={toggleIcon ?? defaultToggleIcon} text={togglerText} />, {
        onClick: onExpand,
    });
    return (
        <CarbonTableExpandHeader
            className={`${eccgui}-simpletable__headexpander` + (className ? ` ${className}` : "")}
            isExpanded={isExpanded}
            onExpand={onExpand}
            enableToggle={false}
            {...otherCarbonTableExpandHeaderProps}
        >
            {enableToggle && toggleButton}
        </CarbonTableExpandHeader>
    );
}

export default TableExpandHeader;
