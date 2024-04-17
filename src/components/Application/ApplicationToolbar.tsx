import React from "react";
import {
    HeaderGlobalBar as CarbonHeaderGlobalBar,
    HeaderGlobalBarProps as CarbonHeaderGlobalBarProps,
} from "carbon-components-react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type ApplicationToolbarProps = CarbonHeaderGlobalBarProps;

export const ApplicationToolbar = ({
    children,
    className = "",
    ...otherCarbonHeaderGlobalBarProps
}: ApplicationToolbarProps) => {
    return (
        <CarbonHeaderGlobalBar
            {...otherCarbonHeaderGlobalBarProps}
            className={`${eccgui}-application__toolbar ` + className}
        >
            {children}
        </CarbonHeaderGlobalBar>
    );
};

export default ApplicationToolbar;
