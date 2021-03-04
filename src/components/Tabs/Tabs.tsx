import React from 'react';
import {
    Tabs as BlueprintTabs,
    Tab,
} from "@blueprintjs/core";

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
                    return (
                        <Tab
                            key={tab.tabId}
                            id={tab.tabId}
                            className={`${prefixTabNames}-header-${tab.tabId}`}
                            title={tab.tabTitle.toUpperCase()}
                            panel={tab.tabContent}
                        />
                    );
                })
            }
        </BlueprintTabs>
    );
};

export default Tabs;
