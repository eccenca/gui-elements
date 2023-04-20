import React from "react";
import {
    DataTable as CarbonDataTable,
    DataTableProps as CarbonDataTableProps,
    TableContainerProps as CarbonTableContainerProps
} from "carbon-components-react";
import { TableRowHeightSize,  tableRowHeightSizes } from "./Table";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface TableDataContainerProps extends Omit<
    CarbonDataTableProps,
    "size" | "overflowMenuOnHover" | "stickyHeader" | "useStaticWidth"
>, React.TableHTMLAttributes<HTMLTableElement> {
    children(signature: any): JSX.Element;
    size?: TableRowHeightSize;
}
interface TableSimpleContainerProps extends Omit<
    CarbonTableContainerProps,
    "description" | "stickyHeader" | "title" | "useStaticWidth"
>, React.HTMLAttributes<HTMLDivElement> {
    children?: JSX.Element;
}

export type TableContainerProps = TableDataContainerProps | TableSimpleContainerProps;

export function TableContainer({
    className = "",
    ...otherProps
}: TableContainerProps) {

    const otherDataTableProps = otherProps as TableDataContainerProps;

    return !!otherDataTableProps.headers || !!otherDataTableProps.rows ? (
        <CarbonDataTable.TableContainer className={`${eccgui}-simpletable__container ` + className}>
            <CarbonDataTable
                {...otherDataTableProps}
                size={
                    otherDataTableProps.size
                        ? tableRowHeightSizes[otherDataTableProps.size]
                        : tableRowHeightSizes.medium
                }
            />
        </CarbonDataTable.TableContainer>
    ) : (
        <CarbonDataTable.TableContainer {...otherProps} className={`${eccgui}-simpletable__container ` + className} />
    );
}

export default TableContainer;
