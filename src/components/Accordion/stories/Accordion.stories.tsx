import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Accordion from '../Accordion'
import AccordionItem from '../AccordionItem';


export default {
    title: "Components/Accordion",
    component: Accordion,
    subcomponents : {AccordionItem},
    argTypes: {
        children : {control : 'text'},
        disabled: {
            description: "text content",
            control: "boolean",
            table: {
                defaultValue: { summary: false },
                type: { summary: "boolean" },
            }
        },
        className: {
            description: "A space-delimited list of class names.",
            control: "text",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "string" },
            }
        },
        onClick: { action: 'clicked' },
        size : {
             control: "radio",  options: [ "sm" , "md" , "lg" ] },
        align : {
        control: "radio",  options: [ "start"  , "end" ] },
             noBorder : {control : 'boolean'},
             state : {control : 'boolean'},
       
    }

} as ComponentMeta<typeof Accordion>;

const TemplateIcons: ComponentStory<typeof Accordion> = (args) => (
    <>
        <Accordion  {...args}>
         <AccordionItem  {...args}></AccordionItem>
        </Accordion>
    </>
);
export const AccordionElement = TemplateIcons.bind({});
AccordionElement.args = {
    children : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    disabled: false,
    noBorder : false,
    state : false,
};


