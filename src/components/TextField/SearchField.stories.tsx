import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CustomSearchField from "./SearchField";

type SearchFieldType = typeof CustomSearchField;

const disabledArgTypes = [
  "hasStatePrimary",
  "hasStateDanger",
  "hasStateWarning",
  "hasStateSuccess",
  "fullWidth",
].reduce((args, field) => {
  args[field] = {
    control: {
      disable: true,
    },
  };
  return args;
}, {});
export default {
  title: "Components/SearchField",
  component: CustomSearchField,
  argTypes: {
    ...disabledArgTypes,
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
  onClearanceText: "",
  onClearanceHandler: () => {},
};

export const SearchFieldWithClearanceIcon: ComponentStory<SearchFieldType> = (
  args
) => {
  const [query, setQuery] = React.useState<string>("");
  return (
    <CustomSearchField
      {...args}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onClearanceHandler={() => setQuery("")}
    ></CustomSearchField>
  );
};
