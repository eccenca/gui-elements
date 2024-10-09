import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { PropertyName, PropertyValue, PropertyValuePair } from "../../../index";

import { Default as NameExample } from "./PropertyName.stories";
import { Default as ValueExample } from "./PropertyValue.stories";

export default {
    title: "Components/PropertyValuePair",
    component: PropertyValuePair,
    subcomponents: {
        PropertyName,
        PropertyValue,
    },
    argTypes: {
        children: {
            control: "none",
            description: "Should be `<PropertyName/>` and `<PropertyValue/>`, 1 of each.",
        },
    },
} as Meta<typeof PropertyValuePair>;

const Template: StoryFn<typeof PropertyValuePair> = (args) => <PropertyValuePair {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: [<PropertyName {...NameExample.args} />, <PropertyValue {...ValueExample.args} />],
};
