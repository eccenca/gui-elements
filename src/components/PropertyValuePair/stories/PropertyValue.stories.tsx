import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { PropertyValue } from "../../../index";

export default {
    title: "Components/PropertyValuePair/Value",
    component: PropertyValue,
    argTypes: {},
} as Meta<typeof PropertyValue>;

const Template: StoryFn<typeof PropertyValue> = (args) => <PropertyValue {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: loremIpsum({ p: 3, avgSentencesPerParagraph: 5, avgWordsPerSentence: 8, random: false }).toString(),
};
