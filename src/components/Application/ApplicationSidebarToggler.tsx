import React from "react";
import {
    HeaderMenuButton as CarbonHeaderMenuButton,
    HeaderMenuButtonProps as CarbonHeaderMenuButtonProps,
} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ApplicationSidebarTogglerProps extends CarbonHeaderMenuButtonProps {};

export const ApplicationSidebarToggler = ({
    className = "",
    ...otherCarbonHeaderMenuButtonProps
}: ApplicationSidebarTogglerProps) => {
    return (
        <CarbonHeaderMenuButton
            className={`${eccgui}-application__menu__toggler ` + className}
            {...otherCarbonHeaderMenuButtonProps}
            isCollapsible={true}
        />
    )
}

export default ApplicationSidebarToggler;
