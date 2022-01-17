import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomToolbar from "./Toolbar";
import CustomToolbarSection from "./ToolbarSection";
import Button from "../Button/Button";
import Spacing from "../Separation/Spacing";

type ToolbarType = typeof CustomToolbar;

export default {
  title: "Components/Toolbar",
  component: CustomToolbar,
  argTypes: {},
} as ComponentMeta<ToolbarType>;

const ToolbarSectionTemplate = ({ children, ...otherArgs }) => (
  <CustomToolbarSection {...otherArgs}>{children}</CustomToolbarSection>
);

export const ToolbarSection = ToolbarSectionTemplate.bind({});

ToolbarSection.args = {
  canGrow: false,
  canShrink: false,
  hideOverflow: false,
};

const Template: ComponentStory<ToolbarType> = (args) => (
  <CustomToolbar {...args}>
    <ToolbarSectionTemplate>
      <Button
        elevated
        text="PrimaryButton"
        hasStatePrimary
        onClick={() => {}}
      />
    </ToolbarSectionTemplate>
    <ToolbarSectionTemplate>
      <Spacing size="tiny" vertical />
      <Button text="Danger Button" hasStateDanger onClick={() => {}} />
    </ToolbarSectionTemplate>
  </CustomToolbar>
);

export const Default = Template.bind({});

Default.args = {
  verticalStack: true,
  noWrap: false,
};
