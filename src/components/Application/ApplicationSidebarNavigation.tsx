import React from "react";
import { SideNav as CarbonSideNav } from "carbon-components-react/lib/components/UIShell";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function ApplicationSidebarNavigation({
    children,
    className,
    defaultExpanded, // takeover this property
    isPersistent, // takeover this property
    isFixedNav, // takeover this property
    isChildOfHeader, // takeover this property
    ...restProps
}: any) {

    const additionalClassName = className ? className : "";

    return (
        <CarbonSideNav
            className={`${eccgui}-application__menu__sidebar ${additionalClassName}`}
            {...restProps}
            aria-label={"sidebar"}
            defaultExpanded={false}
            isPersistent={false}
            isFixedNav={true}
            isChildOfHeader={true}
        >
            {children}
        </CarbonSideNav>
    )
}

export default ApplicationSidebarNavigation;
