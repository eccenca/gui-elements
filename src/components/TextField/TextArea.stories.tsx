import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomTextArea from "./TextArea";

type TextAreaType = typeof CustomTextArea;

export default {
  title: "Components/TextArea",
  component: CustomTextArea,
  argTypes: {
    fill: {
      description:
        "Whether the text area should take up the full width of its container.",
      control: "boolean",
    },
    small: {
      description: "Whether the text area should appear with small styling.",
      control: "boolean",
    },
    large: {
      description: "Whether the text area should appear with large styling",
      control: "boolean",
    },
    growVertically: {
      description:
        "Whether the text area should automatically grow vertically to accommodate content.",
      control: "boolean",
    },
  },
} as ComponentMeta<TextAreaType>;

const Template: ComponentStory<TextAreaType> = (args) => (
  <CustomTextArea {...args}></CustomTextArea>
);

export const Default = Template.bind({});
Default.args = {
  hasStatePrimary: false,
  hasStateSuccess: false,
  hasStateWarning: false,
  hasStateDanger: false,
  fullWidth: false,
  rows: 5,
};
