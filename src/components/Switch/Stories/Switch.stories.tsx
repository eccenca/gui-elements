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

/**
 * By default the `nodrag` class is set, so the switch cannot be used to drag a surrounding element,
 * e.g. a React Flow node. Set `noDrag` to `false` to remove the class and allow the drag interaction.
 */
export const WithoutNoDragClass = Template.bind({});
WithoutNoDragClass.args = {
    ...Default.args,
    label: "Switch label, drag interaction not prevented",
    noDrag: false,
};
