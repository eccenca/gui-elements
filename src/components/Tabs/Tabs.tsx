import React from "react";
import { Tabs as BlueprintTabs, TabsProps as BlueprintTabsProps } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";

import Tab, { TabProps, transformTabProperties } from "./Tab";

export interface TabsProps extends TestableComponent, Omit<BlueprintTabsProps, "vertical" | "large" | "animate"> {
    children?: React.ReactNode;
    /**
     * Data structure containing all tabs, including their titles and content panels.
     * Currently it is not possible to add `Tab` elements direct as children elements to the `<Tabs>` container.
     */
    tabs?: TabProps[];
    /**
     * Allow scrollbars on the tabs header.
     * Otherwise they will be shrinked if not enough space.
     */
    allowScrollbars?: boolean;
    /**
     * If set then a `div` element is used as wrapper.
     * It uses the attributes given via this property.
     */
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Tabs = ({
    tabs = [],
    children,
    className = "",
    allowScrollbars,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    wrapperProps,
    ...restProps
}: TabsProps) => {
    const tabsContent = (
        <BlueprintTabs
            className={className + ` ${eccgui}-tabs` + (allowScrollbars ? ` ${eccgui}-tabs--scrollablelist` : "")}
            {...restProps}
            animate={false}
        >
            {tabs
                ? tabs.map((tab) => {
                      return <Tab {...transformTabProperties(tab)} />;
                  })
                : children}
        </BlueprintTabs>
    );

    return wrapperProps || dataTestId || dataTestid ? (
        <div
            className={`${eccgui}-tabs__wrapper`}
            {...(wrapperProps ?? {})}
            {...{ "data-test-id": dataTestId, "data-testid": dataTestid }}
        >
            {tabsContent}
        </div>
    ) : (
        <>{tabsContent}</>
    );
};

export default Tabs;
