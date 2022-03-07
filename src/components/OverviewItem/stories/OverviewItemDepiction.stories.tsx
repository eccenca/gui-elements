import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Icon from "../../Icon/Icon";

import OverviewItemDepiction from "./../OverviewItemDepiction";

export default {
  title: "Components/OverviewItem/OverviewItemDepiction",
  component: OverviewItemDepiction,
  subcomponents: {Icon },
  argTypes: {
      children: {
          control: "none",
          description: "Element used as depiction."
      }
  },
} as ComponentMeta<typeof OverviewItemDepiction>;

const Template: ComponentStory<typeof OverviewItemDepiction> = (args) => (
  <OverviewItemDepiction {...args}></OverviewItemDepiction>
);

export const Default = Template.bind({});
Default.args = {
    children: <Icon name="artefact-dataset" />
}
