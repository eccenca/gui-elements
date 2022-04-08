import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tabs, TabTitle as TabTitleOrg, Icon} from "./../../../../";

export default {
    title: "Components/Tabs",
    component: TabTitleOrg,
    argTypes: {
    },
} as ComponentMeta<typeof TabTitleOrg>;

const TabTitle = (args) => {
    return (
        <Tabs
            id="titledemo"
            tabs={[
                {
                    id: "titlesimple",
                    title: <TabTitleOrg {...args} />
                }
            ]}
        />
    )
}

const TemplateFull: ComponentStory<typeof TabTitleOrg> = (args) => (
    <TabTitle {...args} />
);

export const TabTitleElement = TemplateFull.bind({});
TabTitleElement.args = {
    text: "Tab title",
    titlePrefix: "[",
    titleSuffix: <span>]</span>,
};
