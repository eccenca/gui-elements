import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomToolbar from "./Toolbar";
import CustomToolbarSection from "./ToolbarSection";
import Button from "../Button/Button";
import Spacing from "../Separation/Spacing";
import SearchField from "../TextField/SearchField";

type ToolbarType = typeof CustomToolbar;

export default {
  title: "Components/Toolbar",
  component: CustomToolbar,
  subcomponents: {
    CustomToolbarSection,
  },
  argTypes: {},
} as ComponentMeta<ToolbarType>;

const Template: ComponentStory<ToolbarType> = (args) => (
  <CustomToolbar {...args}>
    <CustomToolbarSection>
      <Button
        elevated
        text="PrimaryButton"
        hasStatePrimary
        onClick={() => {}}
      />
    </CustomToolbarSection>
    <CustomToolbarSection>
      <Spacing size="tiny" vertical />
      <Button text="Danger Button" hasStateDanger onClick={() => {}} />
    </CustomToolbarSection>
  </CustomToolbar>
);

export const Default = Template.bind({});

Default.args = {
  verticalStack: true,
  noWrap: false,
};
