import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { OverviewItem, OverviewItemList } from "./../../../../index";
import { ItemExample } from "./OverviewItem.stories";

export default {
    title: "Components/OverviewItem",
    component: OverviewItemList,
    subcomponents: {
        OverviewItem,
    },
    argTypes: {
        children: {
            control: false,
            description: "Should contain only `OverviewItem` elements, maybe wrapped inside cards.",
        },
    },
} as Meta<typeof OverviewItemList>;

const Template: StoryFn<typeof OverviewItemList> = (args) => <OverviewItemList {...args}></OverviewItemList>;

export const ItemList = Template.bind({});
ItemList.args = {
    hasSpacing: true,
    hasDivider: true,
    columns: 1,
    children: Array(4).fill(<OverviewItem {...ItemExample.args} />),
};
