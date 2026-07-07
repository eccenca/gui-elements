import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/**
 * Kept structurally identical to the historical Carbon `TableHeadProps` alias
 * so that the public API stays frozen.
 */
export type TableHeadProps = React.ThHTMLAttributes<HTMLTableSectionElement>;

/**
 * Table head section, use it to wrap the header row(s) of the table.
 */
export function TableHead({ className, children, ...otherTableHeadProps }: TableHeadProps) {
    return (
        <thead className={cn(`${eccgui}-simpletable__head`, className)} {...otherTableHeadProps}>
            {children}
        </thead>
    );
}

export default TableHead;
