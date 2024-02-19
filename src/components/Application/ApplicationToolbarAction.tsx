import React from "react";
import {
    HeaderGlobalAction as CarbonHeaderGlobalAction,
    HeaderGlobalActionProps as CarbonHeaderGlobalActionProps,
} from "carbon-components-react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type ApplicationToolbarActionProps = CarbonHeaderGlobalActionProps;

export const ApplicationToolbarAction = ({
    children,
    className = "",
    ...otherCarbonHeaderGlobalActionProps
}: ApplicationToolbarActionProps) => {
    return (
        <CarbonHeaderGlobalAction
            {...otherCarbonHeaderGlobalActionProps}
            className={`${eccgui}-application__toolbar__action ` + className}
        >
            {children}
        </CarbonHeaderGlobalAction>
    );
};

export default ApplicationToolbarAction;
