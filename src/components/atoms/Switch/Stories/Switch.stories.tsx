import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import Switch from "../Switch";

export default {
    title: "Forms/Switch",
    component: Switch,
    argTypes: {},
} as Meta<typeof Switch>;

const Template: StoryFn<typeof Switch> = (args) => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
    label: "Switch label",
    inline: true,
};

export const WithStateLabel = Template.bind({});
WithStateLabel.args = {
    ...Default.args,
    innerLabel: "Off",
    innerLabelChecked: "On",
};
