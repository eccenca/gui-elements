import React from "react";
// import PropTypes from 'prop-types';
import { HeaderGlobalBar as CarbonHeaderGlobalBar } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationToolbar({ children, className = '', ...restProps }: any) {
    return (
        <CarbonHeaderGlobalBar
            {...restProps}
            className={`${eccgui}-application__toolbar ` + className}
        >
            { children }
        </CarbonHeaderGlobalBar>
    )
}

export default ApplicationToolbar;
