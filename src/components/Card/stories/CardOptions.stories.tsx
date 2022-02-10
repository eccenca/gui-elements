import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import IconButton from "../../Icon/IconButton";

import {
  CardOptions,
} from "../index";

export default {
  title: "Components/Card/CardOptions",
  component: CardOptions,
  argTypes: {
      children: {
          control: "none",
          description: "Elements for user-interaction."
      }
  },
} as ComponentMeta<typeof CardOptions>;

const Template: ComponentStory<typeof CardOptions> = (args) => (
    <CardOptions {...args} />
);

export const Default = Template.bind({});
Default.args = {
    children: <IconButton name="item-question" onClick={() => alert("Some action is triggered")} />
}
