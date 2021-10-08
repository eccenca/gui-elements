import React from 'react';
import {
    Tabs as BlueprintTabs,
    Tab,
    TabProps as BlueprintTabProbs,
} from "@blueprintjs/core";
import Button from "../Button/Button";

interface ExtendedTabProps extends BlueprintTabProbs {
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
}: ExtendedTabProps) => {
    const extraStyles = dontShrink ? { style: {flexShrink: 0} } : {};
    return <Tab
        key={otherBlueprintTabProperties.id}
        /*
            TODO: this string condition should not be necessary but currently the application
            do not support usage of the ExtendedTabProps signature (e.g. Query2 module)
        */
        title={typeof title === "string" ? (
            <Button
                minimal
                tabindex={-1}
                text={title}
                icon={titlePrefix}
                rightIcon={titleSuffix}
                small={small}
                large={large}
            />
        ) : title}
        {...otherBlueprintTabProperties}
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
                    const { tabId, tabTitle, tabContent, ...originalTabProps } = tab;
                    return createBlueprintTab({
                        id: tabId,
                        className: `${prefixTabNames}-header-${tabId}`,
                        title: tabTitle,
                        panel: tabContent,
                        ...originalTabProps,
                    });
                })
            }
        </BlueprintTabs>
    );
};

export default Tabs;
