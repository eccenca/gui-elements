import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { name } from 'react-lorem-ipsum'

import MultiSelectExample from "./MultiSelect";

export default {
    title: "Components/MultiSelect",
    component: MultiSelectExample,
    argTypes: {
        placeholder: {
            description: "Input placeholder text",
            control: "text",
            table: {
                type: { summary: "string" },
            },
        },
        items: {
            description: "Array of items in the list",
            control: "none",
        },
        fill: {
            description: "Whether the component should take up the full width of its container",
            control: "boolean",
            table: {
                defaultValue: { summary: true },
                type: { summary: "boolean" },
            },
        },
    },
} as ComponentMeta<typeof MultiSelectExample>;

const Template: ComponentStory<typeof MultiSelectExample> = (args) => <MultiSelectExample {...args} />;

export const Default = Template.bind({});

const items = new Array(5).fill(undefined).map(_ => {
    const testLabel = name();
    return {testLabel, testId: `${testLabel}-id`}
})
Default.args = {
    items,
    canCreateNewItem: true,
    prePopulateWithItems: false,
    equalityProp: "testId",
    labelProp: "testLabel",
};
