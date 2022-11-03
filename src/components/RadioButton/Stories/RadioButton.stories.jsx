import React from "react"
import RadioButton from '../RadioButton'
export default {
    title: "Components/RadioButton",
    component: RadioButton,
    argTypes: {
        children : {control : 'text'},
        disabled : {control : 'boolean'},
        inline : {control : 'boolean'},
        className : {control : 'text'},
        large : {control : 'boolean'},
        onChange : {action : 'clicked'},
    }

}
const RadioButtonExample = (args) => (
    <>
    <RadioButton  {...args}></RadioButton>
    <RadioButton  {...args}></RadioButton>
    </>
);
export const Default  = RadioButtonExample.bind({});
Default.args = {
    children : "RadioButton",
    disabled: false,
    inline : true,
    large : false,
};

