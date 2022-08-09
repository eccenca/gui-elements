import React from "react";
import Switch from '../Switch'

export default {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
   onChange : {control : "action"}
  },
} 

const DefaultArgs = {
    children : "Switch",
    disabled: false,
    indeterminate : false,
    inline : true,
    large : false,
   
  
}
const InnerLabelArgs ={
    ...DefaultArgs,
    innerLabel : 'Off',
    innerLabelChecked : "On"
}

const Template = (args) => (
    <>
    <Switch {...args} />
    <Switch {...args} />
    </>
);
const TemplateWithInnerLabel = (args) => (
    <>
    <Switch  {...args} />
    <Switch  {...args} />
    </>
);

export const DefaultSwitch = Template.bind({});
DefaultSwitch.args = DefaultArgs
export const SwitchWithInnerLabel = TemplateWithInnerLabel.bind({});
SwitchWithInnerLabel.args = InnerLabelArgs