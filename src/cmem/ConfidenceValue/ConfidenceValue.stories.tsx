import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { ConfidenceValue } from "../../../index";

export default {
    title: "cmem/ConfidenceValue",
    component: ConfidenceValue,
    argTypes: {
        barColor: {
            control: "color",
        },
    },
} as ComponentMeta<typeof ConfidenceValue>;

const TemplateIcons: ComponentStory<typeof ConfidenceValue> = (args) => <ConfidenceValue {...args} />;
export const Default = TemplateIcons.bind({});
Default.args = {
    value: "0.5",
};
