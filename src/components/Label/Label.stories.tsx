import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { Icon, Label } from "../../index";

export default {
    title: "Forms/Label",
    component: Label,
    argTypes: {},
} as Meta<typeof Label>;

const Template: StoryFn<typeof Label> = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
    text: "Label text",
    info: loremIpsum({ p: 1, avgSentencesPerParagraph: 1, avgWordsPerSentence: 4, random: false }).toString(),
    tooltip: loremIpsum({ p: 1, avgSentencesPerParagraph: 2, startWithLoremIpsum: false, random: false }).toString(),
    disabled: false,
    htmlFor: "inputid",
    additionalElements: <Icon name={"state-warning"} tooltipText={"message"} small />,
};
