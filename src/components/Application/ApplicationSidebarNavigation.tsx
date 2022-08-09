import React from "react";
import { SideNav as CarbonSideNav } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface IApplicationSidebarNavigationProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    expanded?: boolean;
    isRail?: boolean;
    // do not allow these properties
    defaultExpanded?: never;
    isPersistent?: never;
    isFixedNav?: boolean;
    isChildOfHeader?: never;
}

function ApplicationSidebarNavigation({
    children,
    className,
    isFixedNav = true,
    ...otherProps
}: IApplicationSidebarNavigationProps) {

    const additionalClassName = className ? className : "";

    return (
        <CarbonSideNav
            className={`${eccgui}-application__menu__sidebar ${additionalClassName}`}
            style ={{backgroundColor : 'red'}}
            {...otherProps}
            aria-label={"sidebar"}
            defaultExpanded={false}
            isPersistent={true}
            // isFixedNav={true}
            isChildOfHeader={true}
        >
            {children}
        </CarbonSideNav>
    )
}

export default ApplicationSidebarNavigation;
