import React from "react";
import { TableRow as CarbonTableRow, TableRowProps as CarbonTableRowProps } from "carbon-components-react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TableRowProps extends CarbonTableRowProps, React.TdHTMLAttributes<HTMLTableRowElement> {
    /**
     * Display this row with the styles from a zebra style-enabled table.
     */
    useZebraStyle?: boolean;
}

export function TableRow({ className = "", children, useZebraStyle, ...otherTableRowProps }: TableRowProps) {
    return (
        <CarbonTableRow
            className={
                `${eccgui}-simpletable__row` +
                (useZebraStyle ? ` ${eccgui}-simpletable__row--zebra` : "") +
                (className ? ` ${className}` : "")
            }
            {...otherTableRowProps}
        >
            {children}
        </CarbonTableRow>
    );
}

export default TableRow;
