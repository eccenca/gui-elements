import React from "react";
// import PropTypes from 'prop-types';
import { Header as CarbonHeader } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationHeader({ children, ...restProps }: any) {
    return (
        <CarbonHeader {...restProps} className={`${eccgui}-application__header`}>
            { children }
        </CarbonHeader>
    )
}

export default ApplicationHeader;
