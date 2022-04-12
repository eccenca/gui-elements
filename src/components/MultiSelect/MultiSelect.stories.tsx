import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { name } from "react-lorem-ipsum";

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
        openOnKeyDown: {
            description:
                "If true, the component waits until a keydown event in the TagInput before opening its popover. If false, the popover opens immediately after a mouse click focuses the component's TagInput ",
            control: "boolean",
            defaultValue: false,
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        items: {
            description: "Array of items in the list",
            control: "none",
        },
    },
} as ComponentMeta<typeof MultiSelectExample>;

const Template: ComponentStory<typeof MultiSelectExample> = (args) => <MultiSelectExample {...args} />;

export const Default = Template.bind({});

const items = new Array(5).fill(undefined).map((_) => {
    const testLabel = name();
    return { testLabel, testId: `${testLabel}-id` };
});

Default.args = {
    items,
    canCreateNewItem: true,
    prePopulateWithItems: false,
    equalityProp: "testId",
    labelProp: "testLabel",
    openOnKeyDown: true,
};

const TemplateWithOpenDropdown: ComponentStory<typeof MultiSelectExample> = (args) => <MultiSelectExample {...args} />;

export const openDropdownWhenFocused = TemplateWithOpenDropdown.bind({});

openDropdownWhenFocused.args = {
    items,
    canCreateNewItem: true,
    prePopulateWithItems: false,
    equalityProp: "testId",
    labelProp: "testLabel",
};
