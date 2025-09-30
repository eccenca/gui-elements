import React from "react";
import { Tab, Tabs as BlueprintTabs, TabsProps as BlueprintTabsProps } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

// legacy interface
interface LegacyTabsProps extends Omit<BlueprintTabsProps, "vertical" | "onChange" | "large" | "id" | "animate"> {
    activeTab: string;
    tabs: DeprecatedTabProps[];
    onTabClick?: ({ props }: any) => void;
    prefixTabNames: string;
    allowScrollbars?: boolean;
    /**
     * If controlled usage is enable then a `onTabClick` handler is ncessary to control tab panel content and `activeTab` updates.
     */
    controlled?: boolean;
}

/** @deprecated (v25) all legacy component support will be removed */
export interface DeprecatedTabProps {
    tabId: string;
    tabTitle: React.ReactNode;
    tabContent?: React.JSX.Element;
    dontShrink?: boolean;
    className?: string;
}

const createDeprecatedTab = ({
    tabId,
    tabTitle,
    tabContent,
    dontShrink = false,
    ...otherTabProps
}: DeprecatedTabProps) => {
    const extraStyles = dontShrink ? { style: { flexShrink: 0 } } : {};
    return <Tab key={tabId} id={tabId} title={tabTitle} panel={tabContent} {...otherTabProps} {...extraStyles} />;
};

/** @deprecated (v25) all legacy component support will be removed, switch to `<Tabs />` */
export function TabsReplacement({
    activeTab,
    tabs = [],
    onTabClick,
    controlled = false,
    prefixTabNames,
    className = "",
    allowScrollbars,
    ...restProps
}: LegacyTabsProps) {
    const usagetype = controlled ? { selectedTabId: activeTab } : { defaultSelectedTabId: activeTab };
    return (
        <BlueprintTabs
            id={prefixTabNames}
            onChange={onTabClick}
            className={className + (allowScrollbars ? ` ${eccgui}-tabs--scrollablelist` : "")}
            {...usagetype}
            renderActiveTabPanelOnly={true}
            {...restProps}
            animate={false}
        >
            {tabs.map((tab) => {
                return createDeprecatedTab({
                    className: `${prefixTabNames}-header-${tab.tabId}`,
                    ...tab,
                });
            })}
        </BlueprintTabs>
    );
}
