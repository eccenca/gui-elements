import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { getEnabledColorsProps } from "../../common/utils/colorHash";
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
    allowCustomColor: true,
};

type TemplateColorHashProps = { stringForColorHashValue: string } & Pick<
    ColorFieldProps,
    "onChange" | "allowCustomColor"
> &
    Pick<getEnabledColorsProps, "includeColorWeight" | "includePaletteGroup">;

const TemplateColorHash: StoryFn<TemplateColorHashProps> = (args: TemplateColorHashProps) => (
    <ColorField
        allowCustomColor={args.allowCustomColor}
        colorPresets={ColorField.listColorPalettePresets({
            includeColorWeight: args.includeColorWeight,
            includePaletteGroup: args.includePaletteGroup,
        })}
        value={ColorField.calculateColorHashValue(args.stringForColorHashValue, {
            allowCustomColor: args.allowCustomColor,
            includeColorWeight: args.includeColorWeight,
            includePaletteGroup: args.includePaletteGroup,
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
    includeColorWeight: [300, 500, 700],
    includePaletteGroup: ["layout", "extra"],
    stringForColorHashValue: "My text that will used to create a color hash as initial value.",
};
