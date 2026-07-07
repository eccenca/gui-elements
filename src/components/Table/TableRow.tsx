import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    /**
     * Display this row with the styles from a zebra style-enabled table.
     */
    useZebraStyle?: boolean;
    /**
     * Display this row with "selected" styles.
     */
    isSelected?: boolean;
    /**
     * @deprecated Carbon-era interop property without any effect on a plain row, kept for API compatibility.
     */
    isExpanded?: boolean;
    /**
     * @deprecated Carbon-era interop property without any effect on a plain row, kept for API compatibility.
     */
    onExpand?: React.MouseEventHandler<HTMLButtonElement>;
    /**
     * @deprecated Carbon-era interop property without any effect on a plain row, kept for API compatibility.
     */
    ariaLabel?: string;
    /**
     * @deprecated Carbon-era interop property without any effect on a plain row, kept for API compatibility.
     */
    expandHeader?: string;
}

export function TableRow({
    className = "",
    children,
    useZebraStyle,
    isSelected,
    // Carbon-era interop properties, stripped so that they do not leak to the DOM element
    isExpanded, // eslint-disable-line @typescript-eslint/no-unused-vars
    onExpand, // eslint-disable-line @typescript-eslint/no-unused-vars
    ariaLabel, // eslint-disable-line @typescript-eslint/no-unused-vars
    expandHeader, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...otherTableRowProps
}: TableRowProps) {
    return (
        <tr
            className={cn(
                `${eccgui}-simpletable__row`,
                useZebraStyle && `${eccgui}-simpletable__row--zebra`,
                isSelected && `${eccgui}-simpletable__row--selected`,
                className || undefined,
            )}
            aria-selected={isSelected ? true : undefined}
            {...otherTableRowProps}
        >
            {children}
        </tr>
    );
}

export default TableRow;
