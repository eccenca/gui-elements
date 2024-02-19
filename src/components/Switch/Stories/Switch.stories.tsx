import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Switch from "../Switch";

export default {
    title: "Forms/Switch",
    component: Switch,
    argTypes: {},
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />;

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
