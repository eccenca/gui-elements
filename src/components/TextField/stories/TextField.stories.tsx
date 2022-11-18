import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TextField } from "./../../../../index";
import { helpersArgTypes } from "../../../../.storybook/helpers";

export default {
    title: "Forms/TextField",
    component: TextField,
    argTypes: {
        leftIcon: {
            ...helpersArgTypes.exampleIcon,
        },
        rightElement: {
            ...helpersArgTypes.exampleIcon,
        },
    },
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => (
    <TextField {...args}></TextField>
);

export const Default = Template.bind({});

Default.args = {
    fullWidth: false,
    placeholder: "placeholder text",
    readOnly: false,
};
