import React from 'react';
import {
    Tabs as BlueprintTabs,
    Tab,
    TabProps as BlueprintTabProbs,
} from "@blueprintjs/core";
import Button from "../Button/Button";

// new interface
export interface TabProps extends BlueprintTabProbs {
    // could be used for Icons, etc.
    titlePrefix?: React.ReactNode;
    // could be used for action  buttons, e.g. "close/remove tab"
    titleSuffix?: React.ReactNode;
    // prevent shrinking when too many tabs appear in the list
    dontShrink?: boolean;
    // display tab with larger styling
    large?: boolean;
    // display tabs with smaller styling
    small?: boolean;
}

const createBlueprintTab = ({
    titlePrefix,
    title,
    titleSuffix,
    dontShrink=false,
    large=false,
    small=false,
    ...otherBlueprintTabProperties
}: TabProps) => {
    const extraStyles = dontShrink ? { style: {flexShrink: 0} } : {};
    return <Tab
        key={otherBlueprintTabProperties.id}
        title={(
            <Button
                minimal
                tabIndex={-1}
                text={title}
                icon={<>{titlePrefix}</>}
                rightIcon={<>{titleSuffix}</>}
                small={small}
                large={large}
            />
        )}
        {...otherBlueprintTabProperties}
        {...extraStyles}
    />;
}

// deprecated interface
export interface DeprecatedTabProps {
    tabId: string;
    tabTitle: React.ReactNode;
    tabContent?: JSX.Element;
    dontShrink?: boolean;
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

function Tabs(
    {
        prefixTabNames='tabBar',
        activeTab,
        tabs=[],
        onTabClick,
        ...restProps
    }: any) {
    return (
        <BlueprintTabs
            onChange={onTabClick}
            selectedTabId={activeTab}
            {...restProps}
        >
            {
                tabs.map(tab => {
                    return !!tab.id ? createBlueprintTab({
                        className: `${prefixTabNames}-header-${tab.id}`,
                        ...tab
                    }) : createDeprecatedTab({
                        className: `${prefixTabNames}-header-${tab.tabId}`,
                        ...tab
                    });
                })
            }
        </BlueprintTabs>
    );
};

export default Tabs;
