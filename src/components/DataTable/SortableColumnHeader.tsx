import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import React, { type ReactNode } from "react";

import { cn } from "../../common/utils/cn";

export type SortDirection = "asc" | "desc" | false;

function SortIcon({ direction }: { direction: SortDirection }) {
    if (direction === "asc") return <ArrowUp className="size-3" />;
    if (direction === "desc") return <ArrowDown className="size-3" />;
    return <ArrowUpDown className="size-3 opacity-40" />;
}

export interface SortableColumnHeaderProps {
    label: string;
    /** Current sort state of this column: "asc", "desc" or false (unsorted). */
    sorted: SortDirection;
    /** Cycle the sort state; called on click. */
    onToggle: () => void;
    /** Optional element rendered before the label (e.g. a type badge or icon). */
    leading?: ReactNode;
    className?: string;
}

/**
 * A click-to-sort column header for data tables: optional leading element,
 * truncating label and an asc/desc/none arrow indicator.
 */
export function SortableColumnHeader({ label, sorted, onToggle, leading, className }: SortableColumnHeaderProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={cn("flex w-full items-center gap-1.5 text-left hover:text-foreground", className)}
            title={label}
        >
            {leading}
            <span className="truncate">{label}</span>
            <SortIcon direction={sorted} />
        </button>
    );
}
