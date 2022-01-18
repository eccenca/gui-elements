import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { withTests } from "@storybook/addon-jest";

import CustomButton from "./Button";
import Icon from "../Icon/Icon";

export default {
  title: "Components/Button",
  component: CustomButton,
  argTypes: {
    fill: {
      description: "Whether this button should expand to fill its container.",
      control: "boolean",
    },
    alignText: {
      description:
        "Text alignment within button. By default, icons and text will be centered within the button.",
      options: ["center", "left", "right"],
      control: "select",
    },
    large: {
      description: "Whether this button should use large styles.",
      control: "boolean",
    },
    small: {
      description: "Whether this button should use small styles",
      control: "boolean",
    },
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
  loading: false,
};

Default.parameters = {
  jest: "Button.test.tsx",
};

export const ButtonWithLeftIcon = Template.bind({});
ButtonWithLeftIcon.args = {
  icon: "item-viewdetails",
};

export const ButtonWithRightIcon = Template.bind({});
ButtonWithRightIcon.args = {
  rightIcon: <Icon name="item-download" />,
};