import React from "react";
import FieldItem from '../FieldItem'
import FieldItemRow from '../FieldItemRow'
import FieldSet from '../FieldSet'
export default {
    title: "Components/Form",
    component: FieldItemRow,
    argTypes: {
    }
}

const formExample = (args) => (
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
    title : 'population',
    boxed : false,
    text : 'this is text',
    info : "info",
    tooltip : <div>don</div>,
    tooltipProps : "tolltipProp",
    disabled : false

};

