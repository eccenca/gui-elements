import React from "react";
// import PropTypes from 'prop-types';
import { HeaderGlobalAction as CarbonHeaderGlobalAction } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationToolbarAction({ children, className = '', ...restProps }: any) {
    return (
        <CarbonHeaderGlobalAction
            {...restProps}
            className={`${eccgui}-application__toolbar__action ` + className}
        >
            { children }
        </CarbonHeaderGlobalAction>
    )
}

export default ApplicationToolbarAction;
