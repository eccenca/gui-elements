import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
  CardHeader,
  CardTitle,
  CardOptions,
} from "../index";

import { Default as CardTitleExample } from "./CardTitle.stories";
import { Default as CardOptionsExample } from "./CardOptions.stories";

export default {
  title: "Components/Card/CardHeader",
  component: CardHeader,
  subcomponents: {
    CardTitle,
    CardOptions,
  },
  argTypes: {
      children: {
          control: "none",
          description: "Elements to include into the header."
      }
  },
} as ComponentMeta<typeof CardHeader>;

const Template: ComponentStory<typeof CardHeader> = (args) => (
    <CardHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
    children: [
        <CardTitle {...CardTitleExample.args} key="1" />,
        <CardOptions {...CardOptionsExample.args} key="2" />
    ],
}
