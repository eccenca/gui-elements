import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { OverviewItem, OverviewItemList } from "./../";
import { ItemExample } from "./OverviewItem.stories";

export default {
    title: "Components/OverviewItem",
    component: OverviewItemList,
    subcomponents: {
        OverviewItem,
    },
    argTypes: {
        children: {
            control: "none",
            description: "Should contain only `OverviewItem` elements, maybe wrapped inside cards.",
        },
    },
} as ComponentMeta<typeof OverviewItemList>;

const Template: ComponentStory<typeof OverviewItemList> = (args) => <OverviewItemList {...args}></OverviewItemList>;

export const ItemList = Template.bind({});
ItemList.args = {
    hasSpacing: true,
    hasDivider: true,
    densityHigh: false,
    columns: 1,
    children: [
        <OverviewItem {...ItemExample.args} />,
        <OverviewItem {...ItemExample.args} />,
        <OverviewItem {...ItemExample.args} />,
        <OverviewItem {...ItemExample.args} />,
    ],
};
