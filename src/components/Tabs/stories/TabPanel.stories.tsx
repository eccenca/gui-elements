import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';
import { TabPanel } from "./../../../";

export default {
    title: "Components/Tabs",
    component: TabPanel,
    argTypes: {
    },
} as ComponentMeta<typeof TabPanel>;

const TemplateFull: ComponentStory<typeof TabPanel> = (args) => (
    <TabPanel {...args} />
);

export const TabPanelElement = TemplateFull.bind({});
TabPanelElement.args = {
    children: <LoremIpsum p={1} avgSentencesPerParagraph={4} random={false} />,
    hidden: false
};
