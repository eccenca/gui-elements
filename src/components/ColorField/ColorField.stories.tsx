import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import textFieldTest from "../TextField/stories/TextField.stories";

import { ColorField, ColorFieldProps } from "./ColorField";

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
    ...Default.args,
    colorWeightFilter: [],
    paletteGroupFilter: [],
    allowCustomColor: true,
};

interface TemplateColorHashProps
    extends Pick<ColorFieldProps, "onChange" | "allowCustomColor" | "colorWeightFilter" | "paletteGroupFilter"> {
    stringForColorHashValue: string;
}

const TemplateColorHash: StoryFn<TemplateColorHashProps> = (args: TemplateColorHashProps) => (
    <ColorField
        allowCustomColor={args.allowCustomColor}
        colorWeightFilter={args.colorWeightFilter}
        paletteGroupFilter={args.paletteGroupFilter}
        value={ColorField.calculateColorHashValue(args.stringForColorHashValue, {
            allowCustomColor: args.allowCustomColor,
            colorWeightFilter: args.colorWeightFilter,
            paletteGroupFilter: args.paletteGroupFilter,
        })}
    />
);

/**
 * Component provides a helper function to calculate a color hash from a text,
 * that can be used as `value` or `defaultValue`.
 *
 * ```
 * <ColorField value={ColorField.calculateColorHashValue("MyText")} />
 * ```
 *
 * You can add `options` to set the config for the color palette filters.
 * The same default values like on `ColorField` are used for them.
 */
export const ColorHashValue = TemplateColorHash.bind({});
ColorHashValue.args = {
    ...Default.args,
    allowCustomColor: true,
    colorWeightFilter: [300, 500, 700],
    paletteGroupFilter: ["layout", "extra"],
    stringForColorHashValue: "My text that will used to create a color hash as initial value.",
};
