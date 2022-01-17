import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomSearchField from "./SearchField";

type SearchFieldType = typeof CustomSearchField;

export default {
  title: "Components/SearchField",
  component: CustomSearchField,
  argTypes: {
    emptySearchInputMessage: {
      description: "placeholder text",
    },
    leftIcon: {
      description: "Icon that shows on the left of the search field",
    },
    onClearanceText: {
      description: "Text to show when search field has content",
    },
    onClearanceHandler: {
      description:
        "function that would be executed when the clear button is clicked",
    },
  },
} as ComponentMeta<SearchFieldType>;

const Template: ComponentStory<SearchFieldType> = (args) => (
  <CustomSearchField {...args}></CustomSearchField>
);

export const Default = Template.bind({});
Default.args = {
  className: "",
  emptySearchInputMessage: "Enter search term",
  leftIcon: "operation-search",
  onClearanceText: () => {},
  onClearanceHandler: () => {},
};
