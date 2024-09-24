import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Tabs, TabTitle as TabTitleOrg } from "./../../../";

export default {
    title: "Components/Tabs",
    component: TabTitleOrg,
    argTypes: {},
} as Meta<typeof TabTitleOrg>;

const TabTitle = (args) => {
    return (
        <Tabs
            id="titledemo"
            tabs={[
                {
                    id: "titlesimple",
                    title: <TabTitleOrg {...args} />,
                },
            ]}
        />
    );
};

const TemplateFull: StoryFn<typeof TabTitleOrg> = (args) => <TabTitle {...args} />;

export const TabTitleElement = TemplateFull.bind({});
TabTitleElement.args = {
    text: "Tab title",
    titlePrefix: "[",
    titleSuffix: <span>]</span>,
};
