import React from "react";
import {
    SideNav as CarbonSideNav,
    SideNavProps as CarbonSideNavProps,
} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ApplicationSidebarNavigationProps extends
    Omit<CarbonSideNavProps, "defaultExpanded" | "isPersistent" | "isFixedNav" | "isChildOfHeader">,
    React.HTMLAttributes<HTMLElement> {};

export const ApplicationSidebarNavigation = ({
    children,
    className = "",
    ...otherCarbonSideNavProps
}: ApplicationSidebarNavigationProps) => {

    return (
        <CarbonSideNav
            className={`${eccgui}-application__menu__sidebar ${className}`}
            {...otherCarbonSideNavProps}
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
