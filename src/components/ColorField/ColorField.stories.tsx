import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import textFieldTest from "../TextField/stories/TextField.stories";

import { ColorField } from "./ColorField";

export default {
    title: "Forms/ColorField",
    component: ColorField,
    argTypes: {
        ...textFieldTest.argTypes,
    },
} as Meta<typeof ColorField>;

const Template: StoryFn<typeof ColorField> = (args) => <ColorField {...args}></ColorField>;

export const Default = Template.bind({});
Default.args = {
    onChange: (e) => {
        alert(e.target.value);
    },
};

export const NoPalettePresets = Template.bind({});
NoPalettePresets.args = {
    colorWeightFilter: [],
    paletteGroupFilter: [],
    allowCustomColor: true,
    onChange: (e) => {
        alert(e.target.value);
    },
};
