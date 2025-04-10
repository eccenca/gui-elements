import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../../.storybook/helpers";

import SearchField from "./../SearchField";

export default {
    title: "Components/SearchField",
    component: SearchField,
    argTypes: {
        leftIcon: {
            ...helpersArgTypes.exampleIcon,
        },
        rightElement: {
            ...helpersArgTypes.exampleIcon,
        },
        hasStatePrimary: { table: { disable: true } },
        hasStateSuccess: { table: { disable: true } },
        hasStateWarning: { table: { disable: true } },
        hasStateDanger: { table: { disable: true } },
        fullWidth: { table: { disable: true } },
    },
} as Meta<typeof SearchField>;

const Template: StoryFn<typeof SearchField> = (args) => <SearchField {...args}></SearchField>;

export const Default = Template.bind({});
Default.args = {
    onClearanceHandler: null,
    onClearanceText: "",
};

const SearchFieldWithClearanceIconTemplate: StoryFn<typeof SearchField> = (args) => {
    const [query, setQuery] = React.useState<string>("");
    return (
        <SearchField
            {...args}
            value={query}
            onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
            onClearanceHandler={() => setQuery("")}
        />
    );
};

export const SearchFieldWithClearanceIcon = SearchFieldWithClearanceIconTemplate.bind({});
SearchFieldWithClearanceIcon.args = {
    onClearanceHandler: null,
    onClearanceText: "Clear field",
};
