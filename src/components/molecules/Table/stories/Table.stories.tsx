import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableExpandedRow,
    TableExpandHeader,
    TableExpandRow,
    TableHead,
    TableHeader,
    TableRow,
} from "@/index";

export default {
    title: "Components/Table",
    component: Table,
    subcomponents: {
        TableContainer,
        TableHead,
        TableHeader,
        TableBody,
        TableRow,
        TableCell,
        TableExpandHeader,
        TableExpandRow,
        TableExpandedRow,
    },
    argTypes: {
        columnWidths: {
            control: false,
        },
    },
} as Meta<typeof Table>;

interface ExampleRow {
    id: string;
    name: string;
    type: string;
    status: string;
}

const exampleRows: ExampleRow[] = [
    { id: "1", name: "Person", type: "Class", status: "Mapped" },
    { id: "2", name: "givenName", type: "Property", status: "Mapped" },
    { id: "3", name: "familyName", type: "Property", status: "Unmapped" },
];

const Template: StoryFn<typeof Table> = (args) => (
    <TableContainer>
        <Table {...args}>
            <TableHead>
                <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Status</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {exampleRows.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.status}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export const Default = Template.bind({});
Default.args = {
    size: "medium",
    hasDivider: true,
    useZebraStyles: false,
    colorless: false,
};

const TemplateExpandable: StoryFn<typeof Table> = (args) => {
    const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({ "1": true });

    const toggleRow = (id: string) => {
        setExpandedRows((current) => ({ ...current, [id]: !current[id] }));
    };

    return (
        <TableContainer>
            <Table {...args}>
                <TableHead>
                    <TableRow>
                        <TableExpandHeader togglerText="Expand/collapse all rows" />
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Type</TableHeader>
                        <TableHeader>Status</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {exampleRows.map((row) => (
                        <React.Fragment key={row.id}>
                            <TableExpandRow
                                togglerText={`Toggle details of ${row.name}`}
                                isExpanded={!!expandedRows[row.id]}
                                onExpand={() => toggleRow(row.id)}
                            >
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.status}</TableCell>
                            </TableExpandRow>
                            <TableExpandedRow colSpan={4}>Additional details for {row.name}.</TableExpandedRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export const ExpandableRows = TemplateExpandable.bind({});
ExpandableRows.args = {
    size: "medium",
    hasDivider: true,
};
