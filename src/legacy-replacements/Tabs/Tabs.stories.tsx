import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Tabs } from "./../../legacy-replacements";

export default {
    title: "Legacy/Tabs",
    component: Tabs,
    argTypes: {
    },
} as Meta<typeof Tabs>;

const TemplateDeprecated: StoryFn<typeof Tabs> = (args) => <Tabs {...args} />;

export const DeprecatedUsage = TemplateDeprecated.bind({});
DeprecatedUsage.args = {
    prefixTabNames: "deprecatedtabs",
    activeTab: "deprecatedtab1",
    tabs: [
        {
            tabId: "deprecatedtab1",
            tabTitle: "Tab title 1",
            tabContent: "Tab content 1",
        },
        {
            tabId: "deprecatedtab2",
            tabTitle: "Tab title 2",
            tabContent: "Tab content 2",
        },
        {
            tabId: "deprecatedtab3",
            tabTitle: "Tab title 3",
            tabContent: "Tab content 3",
        },
    ],
};
