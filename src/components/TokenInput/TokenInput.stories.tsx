import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";

import { TokenInput } from "../../index";

export default {
    title: "Components/TokenInput",
    component: TokenInput,
} as Meta<typeof TokenInput>;

const FIELDS = ["orderId", "customerName", "createdAt"];
const BASE = "https://example.org/resource/";

const Template: StoryFn<typeof TokenInput> = (args) => {
    const [value, setValue] = useState(args.value ?? "");
    return <TokenInput {...args} value={value} onChange={setValue} />;
};

export const ChipPalette = Template.bind({});
ChipPalette.args = {
    value: "order/{orderId}",
    fieldNames: FIELDS,
    placeholder: "Build a pattern…",
};

export const StaticBasePrefix = Template.bind({});
StaticBasePrefix.args = {
    value: `${BASE}order/{orderId}`,
    fieldNames: FIELDS,
    baseChip: BASE,
    staticBase: true,
    labels: { baseLabel: "baseIRI" },
};

export const ComboboxTokens = Template.bind({});
ComboboxTokens.args = {
    value: "concatenate {orderId} , '/' , {customerName}",
    fieldNames: FIELDS,
    tokensAs: "combobox",
};
