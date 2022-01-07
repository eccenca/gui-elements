import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomButton from "../components/Button/Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Button",
  component: CustomButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    onClick: {
      action: "clicked",
    },
  },
} as ComponentMeta<typeof CustomButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CustomButton> = (args) => (
  <CustomButton {...args}>Button</CustomButton>
);

export const Primary = Template.bind({});
Primary.args = {
  hasStatePrimary: true,
};

export const Success = Template.bind({});
Success.args = {
  hasStateSuccess: true,
};

export const Warning = Template.bind({});
Warning.args = {
  hasStateWarning: true,
};

export const Danger = Template.bind({});
Danger.args = {
  hasStateDanger: true,
};

export const Elevated = Template.bind({});
Elevated.args = {
  elevated: true,
};

export const Affirmative = Template.bind({});
Affirmative.args = {
  affirmative: true,
};

export const Disruptive = Template.bind({});
Disruptive.args = {
  disruptive: true,
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};

export const ButtonWithLeftIcon = Template.bind({});
ButtonWithLeftIcon.args = {
  icon: "item-viewdetails",
};

export const ButtonWithRightIcon = Template.bind({});
ButtonWithRightIcon.args = {
  rightIcon: "item-download",
};

export const ButtonWithTooltip = Template.bind({});
ButtonWithTooltip.args = {
  tooltip: "This is the tooltip text",
};
