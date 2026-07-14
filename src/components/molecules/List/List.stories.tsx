import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import List from "./List";

export default {
    title: "Components/List",
    component: List,
    argTypes: {
        itemRenderer: {
            control: false,
        },
        itemId: {
            control: false,
        },
    },
} as Meta<typeof List<string>>;

const items = [
    "First list item",
    "Second list item",
    "Third list item",
    "Fourth list item",
    "Fifth list item",
    "Sixth list item",
];

const Template: StoryFn<typeof List<string>> = (args) => <List {...args} />;

export const Default = Template.bind({});
Default.args = {
    items,
    itemId: (item) => item,
    itemRenderer: (item) => item,
};

export const WithLimit = Template.bind({});
WithLimit.args = {
    items,
    itemId: (item) => item,
    itemRenderer: (item) => item,
    limitOptions: {
        initialMax: 2,
        stepSize: 2,
    },
    moreLabel: "Show more items...",
};
