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
    intent: {
      description: "add special class name to display intent of dialog",
    },
    title: {
      description: "The title of the dialog",
    },
    hasBorder: {
      description: "If this dialog should have borders or not",
    },
    preventSimpleClosing: {
      description:
        "If enabled neither closing via ESC key or clicking outside of the component will work, except explicitly specified.",
    },
    actions: {
      description: "include elements to the action row, e.g. Buttons",
      defaultValue: [
        <Button onClick={() => console.log("closed!")}>Close</Button>,
      ],
    },
    headerOptions: {
      description:
        "can contain elements actionable/non-actionable elements in the dialog header",
      defaultValue: [<Icon name="item-info" />],
    },
    size: {
      description: "sets the size of modal box, defaults to regular",
    },
    preventBackdrop: {
      description: "Toggles showing modal backdrop",
    },
    success: {
      description: "set to true if alert dialog displays a success message",
    },
    warning: {
      description: "set to true if alert dialog displays a warning",
    },
    danger: {
      description:
        "set to true if alert dialog displays a strong message about errors or disruptive actions",
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
  title: "SimpleDialog example",
  isOpen: false,
};
