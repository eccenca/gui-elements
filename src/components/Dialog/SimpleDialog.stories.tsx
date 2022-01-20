import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomSimpleDialog from "./SimpleDialog";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

type DialogElementType = typeof CustomSimpleDialog;

export default {
  title: "Components/Dialog/SimpleDialog",
  component: CustomSimpleDialog,
  argTypes: {
    isOpen: {
      defaultValue: false,
      description:
        "Toggles the visibility of the overlay and its children, this prop is required because the component is controlled",
    },
    actions: {
      defaultValue: [
        <Button onClick={() => console.log("closed!")}>Close</Button>,
      ],
    },
    headerOptions: {
      defaultValue: [<Icon name="item-info" />],
    },
  },
} as ComponentMeta<DialogElementType>;

const Template: ComponentStory<DialogElementType> = (args) => (
  <CustomSimpleDialog {...args}>
    <p>SimpleDialog example</p>
  </CustomSimpleDialog>
);

export const Default = Template.bind({});
Default.args = {
  title: "SimpleDialog example",
  isOpen: false,
};
