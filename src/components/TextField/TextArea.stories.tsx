import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomTextArea from "./TextArea";

type TextAreaType = typeof CustomTextArea;

export default {
  title: "Components/TextArea",
  component: CustomTextArea,
  argTypes: {},
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
  fullWidth: true,
  rows: 5,
};
