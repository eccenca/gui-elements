import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AccordionItem from "../AccordionItem";

export default {
    title: "Components/Accordion/AccordionItem",
    component: AccordionItem,
    argTypes: {
        children: {
            control: "none",
            description: "text for an item"
        },
    }

} as ComponentMeta<typeof AccordionItem>;

const Template : ComponentStory<typeof AccordionItem> = (args) => (
    <AccordionItem {...args} />
);
export const Default = Template.bind({});
Default.args = {
    children : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
};