import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { TabPanel } from "./../../../";

export default {
    title: "Components/Tabs",
    component: TabPanel,
    argTypes: {},
} as Meta<typeof TabPanel>;

const TemplateFull: StoryFn<typeof TabPanel> = (args) => <TabPanel {...args} />;

export const TabPanelElement = TemplateFull.bind({});
TabPanelElement.args = {
    children: <LoremIpsum p={1} avgSentencesPerParagraph={4} random={false} />,
    hidden: false,
};
