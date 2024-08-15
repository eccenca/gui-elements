import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { PropertyValueList, PropertyValuePair } from "../../../index";

import { Default as PairExample } from "./PropertyValuePair.stories";

export default {
    title: "Components/PropertyValuePair/List",
    component: PropertyValueList,
    subcomponents: {
        PropertyValuePair,
    },
    argTypes: {
        children: {
            control: "none",
            description: "Shoukd be one or more `<PropertyValuePair />` elements.",
        },
    },
} as Meta<typeof PropertyValueList>;

const Template: StoryFn<typeof PropertyValueList> = (args) => <PropertyValueList {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: [
        <PropertyValuePair {...PairExample.args} hasDivider hasSpacing />,
        <PropertyValuePair {...PairExample.args} hasDivider hasSpacing />,
        <PropertyValuePair {...PairExample.args} hasDivider hasSpacing />,
        <PropertyValuePair {...PairExample.args} hasDivider hasSpacing />,
        <PropertyValuePair {...PairExample.args} hasDivider hasSpacing />,
    ],
};
