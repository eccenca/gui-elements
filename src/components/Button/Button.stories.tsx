import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomButton from "./Button";

export default {
  title: "Button",
  component: CustomButton,
  argTypes: {
    onClick: {
      action: "clicked",
    },
  },
} as ComponentMeta<typeof CustomButton>;

const Template: ComponentStory<typeof CustomButton> = (args) => (
  <CustomButton {...args}>Button</CustomButton>
);

export const Default = Template.bind({});
Default.args = {
  hasStatePrimary: false,
  hasStateSuccess: false,
  hasStateWarning: false,
  hasStateDanger: false,
  elevated: false,
  affirmative: false,
  disruptive: false,
  tooltip: "",
};

export const ButtonWithLeftIcon = Template.bind({});
ButtonWithLeftIcon.args = {
  icon: "item-viewdetails",
};

export const ButtonWithRightIcon = Template.bind({});
ButtonWithRightIcon.args = {
  rightIcon: "item-download",
};
