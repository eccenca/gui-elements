import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import { TestIconProps } from "@/components/atoms/Icon";
import { ValidIconName } from "@/components/atoms/Icon/canonicalIconNames";

import IconButton from "@/components/atoms/Icon/IconButton";

export interface TableExpandHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    /**
     * This text is displayed as tooltip for the button that toggles the expanded/collapsed state.
     */
    togglerText: string;

    /** An optional icon that is shown as toggle icon. */
    toggleIcon?: ValidIconName | string[] | React.ReactElement<TestIconProps>;

    /**
     * If `true` a toggler button is displayed inside the header cell.
     */
    enableToggle?: boolean;

    /**
     * Current expansion state that is represented by the toggler button.
     */
    isExpanded?: boolean;

    /**
     * Callback invoked when the toggler button is clicked, e.g. to expand/collapse all rows of the table.
     */
    onExpand?: React.MouseEventHandler<HTMLButtonElement>;
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
    ...otherTableExpandHeaderProps
}: TableExpandHeaderProps) {
    const defaultToggleIcon: ValidIconName = isExpanded ? "toggler-rowcollapse" : "toggler-rowexpand";
    return (
        <th
            scope="col"
            className={cn(
                `${eccgui}-simpletable__headexpander`,
                "w-8 bg-muted p-0 text-center align-middle",
                className,
            )}
            {...otherTableExpandHeaderProps}
        >
            {enableToggle ? (
                <IconButton
                    size="small"
                    name={toggleIcon ?? defaultToggleIcon}
                    text={togglerText}
                    // cast: `IconButton` is polymorphic (button/anchor) but renders a plain button here
                    onClick={
                        onExpand as React.MouseEventHandler<HTMLButtonElement> &
                            React.MouseEventHandler<HTMLAnchorElement>
                    }
                    aria-expanded={!!isExpanded}
                />
            ) : null}
        </th>
    );
}

export default TableExpandHeader;
