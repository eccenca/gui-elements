import React from "react";
import { DataTable as CarbonDataTable } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function TableContainer({ children, className = "", ...otherProps }: any) {
    if (typeof otherProps.title !== "undefined") {
        otherProps.title = "";
    }
    if (typeof otherProps.description !== "undefined") {
        otherProps.description = "";
    }

    return (typeof children === "function") ? (
        <CarbonDataTable.TableContainer className={`${eccgui}-simpletable__container ` + className}>
            <CarbonDataTable {...otherProps}>
                {children}
            </CarbonDataTable>
        </CarbonDataTable.TableContainer>
    ) : (
        <CarbonDataTable.TableContainer  {...otherProps}className={`${eccgui}-simpletable__container ` + className}>
            {children}
        </CarbonDataTable.TableContainer>
    );
}

export default TableContainer;
