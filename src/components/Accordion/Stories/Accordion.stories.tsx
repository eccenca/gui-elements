import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Accordion, AccordionItem } from "../../../../index";
import { Default as AccordionStoryItem } from "../Stories/AccordionItem.stories";

export default {
    title: "Components/Accordion",
    component: Accordion,
    subcomponents: { AccordionItem },
    argTypes: {
        children: {
            control: "none",
            description: "Elements to include into the Accordion component",
        },
        whitespaceSize: {
            control: "select",
            options: ["none", "small", "medium", "large"],
        },
    },
} as Meta<typeof Accordion>;

const TemplateIcons: StoryFn<typeof Accordion> = (args) => <Accordion {...args} />;
export const Default = TemplateIcons.bind({});
Default.args = {
    children: [
        <AccordionItem {...AccordionStoryItem.args} label="Accordion item 1" />,
        <AccordionItem {...AccordionStoryItem.args} label="Accordion item 2 (elevated)" elevated />,
        <AccordionItem {...AccordionStoryItem.args} label="Accordion item 3 (initially opened)" open />,
        <AccordionItem {...AccordionStoryItem.args} label="Accordion item 4 (disabled)" disabled />,
        <AccordionItem {...AccordionStoryItem.args} label="Accordion item 5" />,
    ],
    align: "start",
    size: "medium",
};
