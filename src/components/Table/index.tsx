import TableContainer, { TableContainerProps } from "./TableContainer";
import Table, { TableProps } from "./Table";
import TableExpandHeader, { TableExpandHeaderProps } from "./TableExpandHeader";
import TableExpandRow, { TableExpandRowProps } from "./TableExpandRow";

export type {
    TableContainerProps,
    TableProps,
    TableExpandHeaderProps,
    TableExpandRowProps,
};

export {
    TableContainer,
    Table,
    TableExpandRow,
    TableExpandHeader,
};

// TODO, we may wrap to add own classes (currently not necessary)
export {
    TableHead,
    TableBody,
    TableRow,
    TableExpandedRow,
    TableHeader,
    TableCell,
} from "carbon-components-react";
