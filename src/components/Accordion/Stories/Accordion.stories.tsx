import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Accordion from '../Accordion'
import AccordionItem from '../AccordionItem';

export default {
    title: "Components/Accordion",
    component: Accordion,
    subcomponents : {AccordionItem},
    argTypes: {
        children: {
            control: "none",
            description: "`<AccordionItem />` elements."
        }
    }

} as ComponentMeta<typeof Accordion>;

const TemplateIcons: ComponentStory<typeof Accordion> = (args) => (
    <Accordion {...args} />
);
export const AccordionElement = TemplateIcons.bind({});
AccordionElement.args = {
    children : [
        <AccordionItem label="Lorem ipsum label">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </AccordionItem>
    ],
};
