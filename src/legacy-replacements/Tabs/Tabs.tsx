import React from 'react';
import {
    Tabs as BlueprintTabs,
    TabsProps as BlueprintTabsProbs,
    Tab,
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

// deprecated interface
interface TabsProps extends Omit<
    BlueprintTabsProbs,
    "vertical" | "onChange" | "large" | "id" | "renderActiveTabPanelOnly"
> {
    activeTab: string;
    tabs: DeprecatedTabProps[];
    onTabClick?: ({props}: any) => void;
    prefixTabNames: string;
    allowScrollbars?: boolean;
    controlled?: boolean;
}

// deprecated interface
export interface DeprecatedTabProps {
    tabId: string;
    tabTitle: React.ReactNode;
    tabContent?: JSX.Element;
    dontShrink?: boolean;
    className?: string;
}

const createDeprecatedTab = ({
    tabId,
    tabTitle,
    tabContent,
    dontShrink=false,
    ...otherTabProps
}: DeprecatedTabProps) => {
    const extraStyles = dontShrink ? { style: {flexShrink: 0} } : {};
    return <Tab
        key={tabId}
        id={tabId}
        title={tabTitle}
        panel={tabContent}
        {...otherTabProps}
        {...extraStyles}
    />;
}

export function TabsReplacement({
    activeTab,
    tabs=[],
    onTabClick,
    controlled = false,
    prefixTabNames,
    className = "",
    allowScrollbars,
    ...restProps
}: TabsProps) {
    const usagetype = controlled ? { selectedTabId: activeTab } : { defaultSelectedTabId: activeTab }
    return (
        <BlueprintTabs
            id={prefixTabNames}
            onChange={onTabClick}
            className={
                className +
                (allowScrollbars ? ` ${eccgui}-tabs--scrollablelist` : "")
            }
            {...usagetype}
            {...restProps}
        >
            {
                tabs.map(tab => {
                    return createDeprecatedTab({
                        className: `${prefixTabNames}-header-${tab.tabId}`,
                        ...tab
                    });
                })
            }
        </BlueprintTabs>
    );
};
