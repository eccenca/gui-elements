import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomModal from "./Modal";
import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader";
import CardTitle from "../Card/CardTitle";

type ModalElementType = typeof CustomModal;

export default {
  title: "Components/Dialog/Modal",
  component: CustomModal,
  argTypes: {
    isOpen: {
      defaultValue: false,
      description:
        "Toggles the visibility of the overlay and its children, this prop is required because the component is controlled",
    },
    size: {
      description: "sets the size of modal box, defaults to regular",
    },
    preventBackdrop: {
      description: "Toggles showing modal backdrop",
    },
  },
} as ComponentMeta<ModalElementType>;

const Template: ComponentStory<ModalElementType> = (args) => (
  <CustomModal {...args}>
    <Card>
      <CardHeader>
        <CardTitle>Modal Example</CardTitle>
      </CardHeader>
    </Card>
  </CustomModal>
);

export const Default = Template.bind({});
Default.args = {
  title: "SimpleDialog example",
  isOpen: false,
};
