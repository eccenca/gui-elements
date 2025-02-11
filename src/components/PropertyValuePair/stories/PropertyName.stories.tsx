import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { Icon, PropertyName } from "../../../index";

export default {
    title: "Components/PropertyValuePair/Name",
    component: PropertyName,
    argTypes: {},
} as Meta<typeof PropertyName>;

const Template: StoryFn<typeof PropertyName> = (args) => <PropertyName {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: loremIpsum({ p: 1, avgSentencesPerParagraph: 1, avgWordsPerSentence: 4, random: false }).toString(),
    labelProps: {
        additionalElements: <Icon name={"state-warning"} tooltipText={"message"} small />,
    },
};
