import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tabs, Tab as TabDummyForStorybook } from "./../../../../";

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
    return (
        <Tabs
            id="titledemo"
            tabs={[args]}
        />
    )
}

const TemplateFull: ComponentStory<typeof TabDummyForStorybook> = (args) => (
    <Tab {...args} />
);

export const TabElement = TemplateFull.bind({});
TabElement.args = {
    id: "tabtest",
    title: "Tab title",
    dontShrink: false,
    panel: <div>Test panel content.</div>
};
