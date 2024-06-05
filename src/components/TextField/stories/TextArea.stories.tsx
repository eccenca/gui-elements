import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../../.storybook/helpers";

import { TextArea } from "./../../../../index";
type TextAreaType = typeof TextArea;

export default {
    title: "Forms/TextArea",
    component: TextArea,
    argTypes: {
        intent: {
            ...helpersArgTypes.exampleIntent,
        },
    },
} as Meta<TextAreaType>;

const Template: StoryFn<TextAreaType> = (args) => <TextArea {...args}></TextArea>;

export const Default = Template.bind({});
Default.args = {
    hasStatePrimary: false,
    hasStateSuccess: false,
    hasStateWarning: false,
    hasStateDanger: false,
    rows: 5,
};
