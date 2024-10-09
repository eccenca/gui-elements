import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Tab as TabDummyForStorybook, Tabs } from "./../../../../";

export default {
    title: "Components/Tabs",
    component: TabDummyForStorybook,
    argTypes: {
        backgroundColor: {
            control: "color",
        },
    },
} as Meta<typeof TabDummyForStorybook>;

const Tab = (args) => {
    return <Tabs id="titledemo" tabs={[args]} />;
};

const TemplateFull: StoryFn<typeof TabDummyForStorybook> = (args) => <Tab {...args} />;

export const TabElement = TemplateFull.bind({});
TabElement.args = {
    id: "tabtest",
    title: "Tab title",
    dontShrink: false,
    panel: <div>Test panel content.</div>,
};
