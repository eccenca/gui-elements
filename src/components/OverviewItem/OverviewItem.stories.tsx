import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomOverviewItem from "./OverviewItem";

export default {
  title: "Components/Overview",
  component: CustomOverviewItem,
  argTypes: {},
} as ComponentMeta<typeof CustomOverviewItem>;


const Template: ComponentStory<typeof CustomOverviewItem> = (args) => (
  <CustomOverviewItem {...args}></CustomOverviewItem>
);

export const Default = Template.bind({});
