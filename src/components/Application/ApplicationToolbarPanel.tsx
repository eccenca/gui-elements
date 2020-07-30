import React from "react";
// import PropTypes from 'prop-types';
import { HeaderPanel as CarbonHeaderPanel } from "carbon-components-react/lib/components/UIShell";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationToolbarPanel({ children, className = '', ...restProps }: any) {
    return (
        <CarbonHeaderPanel
            {...restProps}
            className={`${eccgui}-application__toolbar__panel ` + className}
        >
            { children }
        </CarbonHeaderPanel>
    )
}

export default ApplicationToolbarPanel;
