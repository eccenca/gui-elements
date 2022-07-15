import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
  ContextMenu,
  MenuItem,
} from "../../index";

export default {
  title: "Components/ContextMenu",
  component: ContextMenu,
  subcomponents: { MenuItem },
  argTypes: {
      children: {
          control: "none",
      }
  },
} as ComponentMeta<typeof ContextMenu>;

const Template: ComponentStory<typeof ContextMenu> = (args) => (
    <ContextMenu {...args} />
);

export const Default = Template.bind({});
Default.args = {
    children: [
        <MenuItem key="m0" text={"First option"} />,
        <MenuItem key="m1" text={"Item two"}>
            <MenuItem key="m0" text={"First sub option"} />
            <MenuItem key="m1" text={"Sub item two"} />
        </MenuItem>
    ]
}
