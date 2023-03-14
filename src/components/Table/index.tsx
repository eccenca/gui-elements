import {
    TableHead as CarbonTableHead,
    TableBody as CarbonTableBody,
    TableRow as CarbonTableRow,
    TableExpandedRow as CarbonTableExpandedRow,
    TableHeader, // as CarbonTableHeader,
    TableCell as CarbonTableCell,
} from "carbon-components-react";

import TableContainer, { TableContainerProps } from "./TableContainer";
import Table, { TableProps } from "./Table";
import TableExpandHeader, { TableExpandHeaderProps } from "./TableExpandHeader";
import TableExpandRow, { TableExpandRowProps } from "./TableExpandRow";

// TODO, we may simple wrap to add own classes
const TableHead = CarbonTableHead;
const TableBody = CarbonTableBody;
const TableRow = CarbonTableRow;
const TableExpandedRow = CarbonTableExpandedRow;
// const TableHeader = CarbonTableHeader;
const TableCell = CarbonTableCell;

export type {
    TableContainerProps,
    TableProps,
    TableExpandHeaderProps,
    TableExpandRowProps,
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
