import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { ConfidenceValue } from "../../../index";

export default {
    title: "cmem/ConfidenceValue",
    component: ConfidenceValue,
    argTypes: {
        barColor: {
            control: "color",
        },
    },
} as Meta<typeof ConfidenceValue>;

const TemplateIcons: StoryFn<typeof ConfidenceValue> = (args) => <ConfidenceValue {...args} />;
export const Default = TemplateIcons.bind({});
Default.args = {
    value: "0.5",
};
