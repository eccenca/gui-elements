import React from "react";
import { Header as CarbonHeader } from "@carbon/react";

// import { HeaderProps as CarbonHeaderProps } from "@carbon/react/es/components/UIShell/Header"; // TODO: check later again, currently interface is not exported
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

// workaround to get type/interface
type CarbonHeaderProps = React.ComponentProps<typeof CarbonHeader>;
export type ApplicationHeaderProps = CarbonHeaderProps;

export const ApplicationHeader = ({
    children = "",
    className = "",
    ...otherCarbonHeaderProps
}: ApplicationHeaderProps) => {
    return (
        <CarbonHeader className={`${eccgui}-application__header ${className}`} {...otherCarbonHeaderProps}>
            {children}
        </CarbonHeader>
    );
};

export default ApplicationHeader;
