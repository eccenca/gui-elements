import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { TextArea as CustomTextArea } from "./../../../../index";
type TextAreaType = typeof CustomTextArea;

export default {
    title: "Forms/TextArea",
    component: CustomTextArea,
    argTypes: {},
} as Meta<TextAreaType>;

const Template: StoryFn<TextAreaType> = (args) => <CustomTextArea {...args}></CustomTextArea>;

export const Default = Template.bind({});
Default.args = {
    hasStatePrimary: false,
    hasStateSuccess: false,
    hasStateWarning: false,
    hasStateDanger: false,
    rows: 5,
};
