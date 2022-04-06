import React from 'react';
import {
    Tabs as BlueprintTabs,
    TabsProps as BlueprintTabsProbs,
    Tab,
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

// deprecated interface
interface TabsProps extends Omit<BlueprintTabsProbs, "vertical" | "onChange" | "large"> {
    activeTab: string;
    tabs: DeprecatedTabProps[];
    onTabClick?: ({props}: any) => void;
    prefixTabNames?: string;
    allowScrollbars?: boolean;
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
    dontShrink=false
}: DeprecatedTabProps) => {
    const extraStyles = dontShrink ? { style: {flexShrink: 0} } : {};
    return <Tab
        key={tabId}
        id={tabId}
        title={tabTitle}
        panel={tabContent}
        {...extraStyles}
    />;
}

export function TabsReplacement(
    {
        activeTab,
        tabs=[],
        onTabClick,
        prefixTabNames='tabBar',
        className = "",
        allowScrollbars,
        ...restProps
    }: TabsProps) {
    return (
        <BlueprintTabs
            onChange={onTabClick}
            selectedTabId={activeTab}
            className={
                className +
                (allowScrollbars ? ` ${eccgui}-tabs--scrollablelist` : "")
            }
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
