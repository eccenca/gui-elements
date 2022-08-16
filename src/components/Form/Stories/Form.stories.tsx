import React from "react";
import FieldItem from '../FieldItem'
import FieldItemRow from '../FieldItemRow'
import { ComponentStory, ComponentMeta } from "@storybook/react";
export default {
    title: "Components/Form",
    component: FieldItemRow,
    argTypes: {
    }
}as ComponentMeta<typeof FieldItemRow>

const formExample: ComponentStory<typeof FieldItemRow> = (args) => (
    <>
     <FieldItemRow >
   <FieldItem {...args}>{args.title}</FieldItem>
   <FieldItem {...args}>{args.title}</FieldItem>
   </FieldItemRow>
   <FieldItemRow >
   <FieldItem {...args}>{args.title}</FieldItem>
   <FieldItem {...args}>{args.title}</FieldItem>
   </FieldItemRow>   <FieldItemRow >
   <FieldItem {...args}>{args.title}</FieldItem>
   <FieldItem {...args}>{args.title}</FieldItem>
   </FieldItemRow>
    </>
);

export const Default  = formExample.bind({});
Default.args = {
    hasStatePrimary : false,
    hasStateSuccess : false,
    hasStateWarning : false,
    hasStateDanger : false,
    helperText : 'this is helper text',
    messageText : "message text",
    title : 'Title',
    boxed : false,
    text : 'this is text',
    info : "info",
    tooltipProps : "tolltipProp",
    disabled : false

};

