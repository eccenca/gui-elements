import React from "react";
import { HeaderMenuButton as CarbonHeaderMenuButton } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationSidebarToggler({isApplicationSidebarExpanded, ...restProps }: any) {
    return (
        <CarbonHeaderMenuButton
      isActive={isApplicationSidebarExpanded}
            className={`${eccgui}-application__menu__toggler`}
            {...restProps}
            isCollapsible={false}
        />
    )
}

export default ApplicationSidebarToggler;
