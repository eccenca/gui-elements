import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { HtmlContentBlock, RadioButton } from "../../../../index";

export default {
    title: "Forms/RadioButton",
    component: RadioButton,
    argTypes: {
        onChange: { action: "clicked" },
    },
} as ComponentMeta<typeof RadioButton>;

const Template: ComponentStory<typeof RadioButton> = (args) => <RadioButton {...args} />;

export const SimpleTextLabel = Template.bind({});
SimpleTextLabel.args = {
    label: "Radio button label",
    inline: true,
};

export const ElementsAsLabel = Template.bind({});
ElementsAsLabel.args = {
    ...SimpleTextLabel.args,
    label: undefined,
    inline: false,
    children: (
        <HtmlContentBlock>
            <LoremIpsum p={3} avgSentencesPerParagraph={3} random={false} />
        </HtmlContentBlock>
    ),
};
