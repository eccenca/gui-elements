import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import FieldItem from '../FieldItem';

export default {
    title: "Components/Form/FieldItem",
    component: FieldItem,
    argTypes: {
        children: {
            control: "none",
            description: "Elements to include into the Accordion component"
        },
        hasStatePrimary : {
            control : 'boolean',
            discription : "primary color state"
        },
        hasStateSuccess : {
            control : 'boolean',
            discription : "success color state"
        },
        hasStateWarning : {
            control : 'boolean',
            discription : "warning color state"
        },
        hasStateDanger : {
            control : 'boolean',
            discription : "danger color state"
        },
    }

} as ComponentMeta<typeof FieldItem>;

const Template: ComponentStory<typeof FieldItem> = (args) => (
    <FieldItem {...args} />
);  
export const Default = Template.bind({});
Default.args = {
    children : [
        "Form Title"
    ],
 messageText : "It is a long established fact that a reader will be distracted by the readable content of a page",
 helperText: "this is the helper text",
};