import React from "react";
// import PropTypes from 'prop-types';
import { Content as CarbonContent } from "carbon-components-react/lib/components/UIShell";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationContent({ children }: any) {
    return (
        <CarbonContent className={`${eccgui}-application__content`}>
            { children }
        </CarbonContent>
    )
}

export default ApplicationContent;
