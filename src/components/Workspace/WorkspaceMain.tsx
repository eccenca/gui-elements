import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
// import PropTypes from 'prop-types';
import GridColumn from "./../Grid/GridColumn";

function WorkspaceMain({ children, className = "", ...restProps }: any) {
    return (
        <GridColumn {...restProps} className={`${eccgui}-workspace__main ` + className}>
            {children}
        </GridColumn>
    );
}

export default WorkspaceMain;
