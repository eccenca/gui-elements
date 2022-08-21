import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Switch from '../Switch'

export default {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
   onChange : {control : "action"},
   disabled: {control : "boolean"},
   indeterminate : {control : "boolean"},
   inline : {control : "boolean"},
   large : {control : "boolean"},
   innerLabel : {control : "string"},
   innerLabelChecked : {control : "string"}
  },
} as ComponentMeta<typeof Switch>

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

const Template: ComponentStory<typeof Switch> = (args) => (
    <>
    <Switch {...args} />
    <Switch {...args} />
    </>
);
const TemplateWithInnerLabel : ComponentStory<typeof Switch> = (args) => (
    <>
    <Switch  {...args} />
    <Switch  {...args} />
    </>
);

export const DefaultSwitch = Template.bind({});
DefaultSwitch.args = DefaultArgs
export const SwitchWithInnerLabel = TemplateWithInnerLabel.bind({});
SwitchWithInnerLabel.args = InnerLabelArgs