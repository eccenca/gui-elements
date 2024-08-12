import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { Accordion, AccordionItem, HtmlContentBlock } from "../../../../index";

export default {
    title: "Components/Accordion/AccordionItem",
    component: AccordionItem,
    argTypes: {
        children: {
            control: "none",
            description: "content of accordion item",
        },
        whitespaceSize: {
            control: "select",
            options: ["none", "small", "medium", "large"],
        },
        separationSize: {
            control: "select",
            options: ["none", "small", "medium", "large"],
        },
    },
} as Meta<typeof AccordionItem>;

const Template: StoryFn<typeof AccordionItem> = (args) => (
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
