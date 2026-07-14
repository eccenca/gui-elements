import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { OverviewItemListPerformance } from "./OverviewItemListPerformance";

export default {
    title: "Components/OverviewItem",
    component: OverviewItemListPerformance,
    argTypes: {},
} as Meta<typeof OverviewItemListPerformance>;

const Template: StoryFn<typeof OverviewItemListPerformance> = (args) => (
    <OverviewItemListPerformance {...args}></OverviewItemListPerformance>
);

export const ListPerformance = Template.bind({});
ListPerformance.args = {
    useOverviewitem: true,
};
