import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
  OverviewItem as CustomOverviewItem,
  OverviewItemActions,
  OverviewItemDepiction,
  OverviewItemLine,
  OverviewItemDescription,
  OverviewItemList,
} from "./";

export default {
  title: "Components/Overview",
  component: CustomOverviewItem,
  subcomponents: {
    OverviewItemActions,
    OverviewItemDepiction,
    OverviewItemLine,
    OverviewItemDescription,
    OverviewItemList,
  },
  argTypes: {},
} as ComponentMeta<typeof CustomOverviewItem>;

const Template: ComponentStory<typeof CustomOverviewItem> = (args) => (
  <CustomOverviewItem {...args}></CustomOverviewItem>
);

export const Default = Template.bind({});
