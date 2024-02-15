import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Accordion, AccordionItem, HtmlContentBlock } from "../../../../index";

export default {
    title: "Components/Accordion/AccordionItem",
    component: AccordionItem,
    argTypes: {
        children: {
            control: "none",
            description: "content of accordion item",
        },
    },
} as ComponentMeta<typeof AccordionItem>;

const Template: ComponentStory<typeof AccordionItem> = (args) => (
    <Accordion>
        <AccordionItem {...args} />
    </Accordion>
);
export const Default = Template.bind({});
Default.args = {
    label: "Title of accordion item",
    children: (
        <HtmlContentBlock>
            <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
        </HtmlContentBlock>
    ),
};
