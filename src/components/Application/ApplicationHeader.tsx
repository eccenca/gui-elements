import React from "react";
import { Header as CarbonHeader, HeaderProps as CarbonHeaderProps } from "carbon-components-react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type ApplicationHeaderProps = CarbonHeaderProps;

export const ApplicationHeader = ({
    children = "",
    className = "",
    ...otherCarbonHeaderProps
}: ApplicationHeaderProps) => {
    return (
        <CarbonHeader className={`${eccgui}-application__header ` + className} {...otherCarbonHeaderProps}>
            {children}
        </CarbonHeader>
    );
};

export default ApplicationHeader;
