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
    // display tab with larger styling
    large?: boolean;
    // display tabs with smaller styling
    small?: boolean;
}

const createBlueprintTab = ({
    titlePrefix,
    title,
    titleSuffix,
    large=false,
    small=false,
    ...otherBlueprintTabProperties
}: ExtendedTabProps) => {
    return <Tab
        key={otherBlueprintTabProperties.id}
        title={(
            <Button text={title} minimal small={small} large={large} tabindex={-1}/>
        )}
        {...otherBlueprintTabProperties}
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
                    return createBlueprintTab({
                        id: tab.tabId,
                        className: `${prefixTabNames}-header-${tab.tabId}`,
                        title: tab.tabTitle,
                        panel: tab.tabContent,
                    });
                })
            }
        </BlueprintTabs>
    );
};

export default Tabs;
