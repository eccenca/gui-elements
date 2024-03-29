import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FieldItem, TextField } from "../../../../index";

export default {
    title: "Forms/FieldItem",
    component: FieldItem,
    argTypes: {
        children: {
            control: "none",
        },
    },
} as ComponentMeta<typeof FieldItem>;

const Template: ComponentStory<typeof FieldItem> = (args) => <FieldItem {...args} />;
export const Default = Template.bind({});
Default.args = {
    children: <TextField />,
    messageText: <LoremIpsum p={1} avgSentencesPerParagraph={2} random={false} />,
    helperText: <LoremIpsum p={1} avgSentencesPerParagraph={1} random={false} />,
    labelProps: {
        text: "Input label",
    },
};
