import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Accordion from '../Accordion'
import AccordionItem from '../AccordionItem';
import {Default as AccordionStoryItem} from '../Stories/AccordionItem.stories'

export default {
    title: "Components/Accordion",
    component: Accordion,
    argTypes: {
        children: {
            control: "none",
            description: "Elements to include into the Accordion component"
        },
    }

} as ComponentMeta<typeof Accordion>;

const TemplateIcons: ComponentStory<typeof Accordion> = (args) => (
    <Accordion {...args} />
);  
export const Default = TemplateIcons.bind({});
Default.args = {
    children : [
       <AccordionItem {...AccordionStoryItem.args} />
    ],
};

