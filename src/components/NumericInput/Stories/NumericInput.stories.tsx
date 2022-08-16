import React from "react" ;
import { ComponentStory, ComponentMeta } from "@storybook/react";
import NumericInput from '../NumericInput'
export default {
    title: "Components/NumericInput",
    component: NumericInput,
 
    argTypes: {
    buttonPosition : {control : 'radio' , options : ["left" , "right" , "none"]}
    }

}as ComponentMeta<typeof NumericInput>
const NumericInputExample: ComponentStory<typeof NumericInput> = (args) => (
    <>
<NumericInput {...args}/>
    </>
);
export const Default  = NumericInputExample.bind({});
Default.args = {
className : '',
allowNumericCharactersOnly : true,
stepSize : 2,
defaultValue : 0,
disabled : false,
fill : false,
large : false,
leftIcon : 'array-numeric',
majorStepSize : 1,
max : 200,
min : 0,
placeholder : 'Enter number',
};