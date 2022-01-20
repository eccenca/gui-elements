import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomAlertDialog from "./AlertDialog";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

type AlertDialogType = typeof CustomAlertDialog;

export default {
  title: "Components/Dialog/AlertDialog",
  component: CustomAlertDialog,
  argTypes: {
    actions: {
      defaultValue: [
        <Button onClick={() => console.log("closed!")}>Close</Button>,
      ],
    },
    isOpen: {
      defaultValue: false,
      description:
        "Toggles the visibility of the overlay and its children, this prop is required because the component is controlled",
    },
    headerOptions: {
      defaultValue: [<Icon name="item-info" />],
    },
  },
} as ComponentMeta<AlertDialogType>;

const Template: ComponentStory<AlertDialogType> = (args) => (
  <CustomAlertDialog {...args}>
    <p>Alert Dialog Example</p>
  </CustomAlertDialog>
);

export const Default = Template.bind({});
Default.args = {
  title: "AlertDialog Example",
  isOpen: false,
};
