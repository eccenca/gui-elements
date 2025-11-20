import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../../.storybook/helpers";
import { ProgressBar } from "../../../../index";
export default {
    title: "Components/ProgressBar",
    component: ProgressBar,
    argTypes: {
        intent: {
            ...helpersArgTypes.exampleIntent,
            options: ["UNDEFINED", "primary", "success", "warning", "danger"],
        },
    },
} as Meta<typeof ProgressBar>;

const ProgressBarExample: StoryFn<typeof ProgressBar> = (args) => <ProgressBar {...args}></ProgressBar>;

export const Default = ProgressBarExample.bind({});
Default.args = {
    value: 0.61,
    stripes: false,
    animate: false,
};

export const IndeterminateBar = ProgressBarExample.bind({});
IndeterminateBar.args = {};
