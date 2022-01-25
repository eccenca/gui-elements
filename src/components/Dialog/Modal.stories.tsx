import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomModal from "./Modal";
import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader";
import CardTitle from "../Card/CardTitle";

type ModalElementType = typeof CustomModal;

export default {
  title: "Components/Modal",
  component: CustomModal,
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
  isOpen: true,
};
