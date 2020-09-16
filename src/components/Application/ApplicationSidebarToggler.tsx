import React from "react";
import { HeaderMenuButton as CarbonHeaderMenuButton } from "carbon-components-react/lib/components/UIShell";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationSidebarToggler({ ...restProps }: any) {
    return (
        <CarbonHeaderMenuButton
            className={`${eccgui}-application__menu__toggler`}
            {...restProps}
            isCollapsible={true}
        />
    )
}

export default ApplicationSidebarToggler;
