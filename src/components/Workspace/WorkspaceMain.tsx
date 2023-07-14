import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import GridColumn, { GridColumnProps } from "./../Grid/GridColumn";

export interface WorkspaceMainProps extends GridColumnProps {};

export const WorkspaceMain = ({ children, className = "", ...restProps }: GridColumnProps) => {
    return (
        <GridColumn {...restProps} className={`${eccgui}-workspace__main ` + className}>
            {children}
        </GridColumn>
    );
}

export default WorkspaceMain;
