import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Checkbox, HtmlContentBlock } from "../../../../index";

export default {
    title: "Forms/Checkbox",
    component: Checkbox,
    argTypes: {
        onChange: { action: "clicked" },
    },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const SimpleTextLabel = Template.bind({});
SimpleTextLabel.args = {
    label: "Checkbox label",
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
