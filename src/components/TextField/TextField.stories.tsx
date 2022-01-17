import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomTextField from "./TextField";

type TextFieldType = typeof CustomTextField;

export default {
  title: "Components/TextField",
  component: CustomTextField,
  argTypes: {},
} as ComponentMeta<TextFieldType>;

const Template: ComponentStory<TextFieldType> = (args) => (
  <CustomTextField {...args}></CustomTextField>
);

export const Default = Template.bind({});
