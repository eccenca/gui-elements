import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
// import PropTypes from 'prop-types';
import GridColumn from "./../Grid/GridColumn";

function WorkspaceSide({ children, className = '', ...restProps }: any) {
    return (
        <GridColumn
            {...restProps}
            className={`${eccgui}-workspace__side `+className}
            sm={4} md={8} lg={5} xlg={5}
        >
            { children }
        </GridColumn>
    )
}

export default WorkspaceSide;
