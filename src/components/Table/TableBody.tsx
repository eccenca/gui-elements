import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    /**
     * `aria-live` politeness setting for announcements of changed table content.
     * Defaults to `polite` (Carbon-era behavior).
     */
    "aria-live"?: "polite" | "assertive" | "off";
}

/**
 * Table body section, use it to wrap the data row(s) of the table.
 */
export function TableBody({ className, children, ...otherTableBodyProps }: TableBodyProps) {
    return (
        <tbody
            aria-live={otherTableBodyProps["aria-live"] ?? "polite"}
            {...otherTableBodyProps}
            className={cn(`${eccgui}-simpletable__body`, className)}
        >
            {children}
        </tbody>
    );
}

export default TableBody;
