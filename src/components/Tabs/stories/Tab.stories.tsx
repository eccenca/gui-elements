import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Tab as TabDummyForStorybook, Tabs } from "./../../../../";

export default {
    title: "Components/Tabs",
    component: TabDummyForStorybook,
    argTypes: {
        backgroundColor: {
            control: "color",
        },
    },
} as ComponentMeta<typeof TabDummyForStorybook>;

const Tab = (args) => {
    return <Tabs id="titledemo" tabs={[args]} />;
};

const TemplateFull: ComponentStory<typeof TabDummyForStorybook> = (args) => <Tab {...args} />;

export const TabElement = TemplateFull.bind({});
TabElement.args = {
    id: "tabtest",
    title: "Tab title",
    dontShrink: false,
    panel: <div>Test panel content.</div>,
};
