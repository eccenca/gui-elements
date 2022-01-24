import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

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
    minimal: {
      description: "Whether this button should use minimal styles.",
      control: "boolean",
    },
    outlined: {
      description: "Whether this button should use outlined styles.",
      control: "boolean",
    },
    icon: {
      control: {
        disable: true,
      },
    },
    rightIcon: {
      control: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof CustomButton>;

const Template: ComponentStory<typeof CustomButton> = (args) => (
  <CustomButton {...args} text="Button"/>
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

export const AffirmativeButton = Template.bind({});
AffirmativeButton.args = { 
   affirmative: true
}

export const DisruptiveButton = Template.bind({});
DisruptiveButton.args = {
  disruptive: true
} 