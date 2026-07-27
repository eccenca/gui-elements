import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";

import { shadcn, SortableColumnHeader, SortDirection, ValueChips } from "@/index";

const { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } = shadcn;

export default {
    title: "Components/Table Accessories",
    component: SortableColumnHeader,
} as Meta<typeof SortableColumnHeader>;

const rows = [
    { name: "orders", values: ["o-1", "o-2", "o-3", "o-4", "o-5", "o-6", "o-7", "o-8", "o-9", "o-10"] },
    { name: "customer", values: ["Jane Doe"] },
    { name: "note", values: [""] },
];

/** A dashboard-style table combining sortable headers with overflow-capped value chips. */
export const SortableTableWithChips: StoryFn = () => {
    const [sorted, setSorted] = useState<SortDirection>(false);
    const toggle = () => setSorted((s) => (s === false ? "asc" : s === "asc" ? "desc" : false));
    const display =
        sorted === false ? rows : [...rows].sort((a, b) => (sorted === "asc" ? 1 : -1) * a.name.localeCompare(b.name));
    return (
        <Table className="w-[28rem]">
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <SortableColumnHeader label="Field" sorted={sorted} onToggle={toggle} />
                    </TableHead>
                    <TableHead>Values</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {display.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell className="align-top font-mono text-xs">{row.name}</TableCell>
                        <TableCell>
                            <ValueChips values={row.values} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
