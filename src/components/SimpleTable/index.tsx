import {
    TableHead as CarbonTableHead,
    TableBody as CarbonTableBody,
    TableRow as CarbonTableRow,
    TableExpandRow as CarbonTableExpandRow,
    TableExpandedRow as CarbonTableExpandedRow,
    TableHeader as CarbonTableHeader,
    TableExpandHeader as CarbonTableExpandHeader,
    TableCell as CarbonTableCell,
} from "carbon-components-react";

import TableContainer, { TableContainerProps } from "./TableContainer";
import Table, { TableProps } from "./Table";

// TODO, we may simple wrap to add own classes
const TableHead = CarbonTableHead;
const TableBody = CarbonTableBody;
const TableRow = CarbonTableRow;
const TableExpandRow = CarbonTableExpandRow;
const TableExpandedRow = CarbonTableExpandedRow;
const TableHeader = CarbonTableHeader;
const TableExpandHeader = CarbonTableExpandHeader;
const TableCell = CarbonTableCell;

export type {
    TableContainerProps,
    TableProps,
};

export {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableExpandRow,
    TableExpandedRow,
    TableHeader,
    TableExpandHeader,
    TableCell,
};
