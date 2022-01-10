import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomSimpleDialog from "./SimpleDialog";
import { ClassNames as IntentClassNames } from "../../common/Intent";

type DialogElementType = typeof CustomSimpleDialog;

export default {
  title: "SimpleDialog",
  component: CustomSimpleDialog,
  argTypes: {
    intentClassName: {
      control: {
        type: "radio",
        options: Object.values(IntentClassNames),
      },
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
  title: "Dialog Example",
  isOpen: true,
};
