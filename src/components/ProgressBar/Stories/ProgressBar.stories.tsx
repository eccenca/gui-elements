import React from "react";
import { ProgressBar } from "../../../../index";
import { ComponentStory, ComponentMeta } from "@storybook/react";
export default {
    title: "Components/ProgressBar",
    component: ProgressBar,
    argTypes: {
    }

} as ComponentMeta<typeof ProgressBar>

const ProgressBarExample : ComponentStory<typeof ProgressBar> = (args) => (
    <ProgressBar {...args}></ProgressBar>
);

export const Default  = ProgressBarExample.bind({});
Default.args = {
    value : 0.61,
    stripes: false,
    animate : false
};

export const IndeterminateBar  = ProgressBarExample.bind({});
IndeterminateBar.args = {
};
