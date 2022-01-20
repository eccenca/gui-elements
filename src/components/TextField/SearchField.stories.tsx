import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomSearchField from "./SearchField";

type SearchFieldType = typeof CustomSearchField;

export default {
  title: "Components/SearchField",
  component: CustomSearchField,
  argTypes: {},
} as ComponentMeta<SearchFieldType>;

const Template: ComponentStory<SearchFieldType> = (args) => (
  <CustomSearchField {...args}></CustomSearchField>
);

export const Default = Template.bind({});
Default.args = {
  className: "",
  emptySearchInputMessage: "Enter search term",
  leftIcon: "operation-search",
  onClearanceText: "",
  onClearanceHandler: () => {},
};
