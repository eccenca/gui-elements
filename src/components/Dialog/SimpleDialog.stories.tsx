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
