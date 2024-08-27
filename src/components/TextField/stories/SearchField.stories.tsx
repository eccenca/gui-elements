import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import SearchField from "./../SearchField";

export default {
    title: "Components/SearchField",
    component: SearchField,
    argTypes: {
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

export const SearchFieldWithClearanceIcon: StoryFn<typeof SearchField> = (args) => {
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
