import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Checkbox, HtmlContentBlock } from "../../../../index";
import { LoremIpsum } from 'react-lorem-ipsum';

export default {
    title: "Components/Checkbox",
    component:  Checkbox,
    argTypes: {
        onChange : {action : 'clicked'}
    },
} as ComponentMeta<typeof Checkbox>

const TemplateIcons:ComponentStory<typeof Checkbox>  = (args) => (
    <Checkbox  {...args} />
);

export const SimpleTextLabel = TemplateIcons.bind({});
SimpleTextLabel.args = {
    label : "Checkbox label",
    inline : true,
};

export const ElementsAsLabel = TemplateIcons.bind({});
ElementsAsLabel.args = {
    ...SimpleTextLabel.args,
    label : undefined,
    inline : false,
    children: <HtmlContentBlock><LoremIpsum p={3} avgSentencesPerParagraph={3} random={false} /></HtmlContentBlock>
};
