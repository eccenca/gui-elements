import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomAlertDialog from "./AlertDialog";

type AlertDialogType = typeof CustomAlertDialog;

export default {
  title: "Components/AlertDialog",
  component: CustomAlertDialog,
} as ComponentMeta<AlertDialogType>;

const Template: ComponentStory<AlertDialogType> = (args) => (
  <CustomAlertDialog {...args}>
    <p>Alert Dialog Example</p>
  </CustomAlertDialog>
);

export const Default = Template.bind({});
Default.args = {
  title: "Dialog title",
  isOpen: true,
};
