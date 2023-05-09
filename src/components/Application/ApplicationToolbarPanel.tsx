import React from "react";
import {
    HeaderPanel as CarbonHeaderPanel,
    HeaderPanelProps as CarbonHeaderPanelProps,
} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ApplicationToolbarPanelProps extends CarbonHeaderPanelProps {};

export const ApplicationToolbarPanel = ({
    children,
    className = "",
    ...otherCarbonHeaderPanelProps
}: ApplicationToolbarPanelProps) => {
    return (
        <CarbonHeaderPanel
            {...otherCarbonHeaderPanelProps}
            className={`${eccgui}-application__toolbar__panel ` + className}
        >
            { children }
        </CarbonHeaderPanel>
    )
}

export default ApplicationToolbarPanel;
