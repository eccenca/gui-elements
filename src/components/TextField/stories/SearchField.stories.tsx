import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof SearchField>;

const Template: ComponentStory<typeof SearchField> = (args) => <SearchField {...args}></SearchField>;

export const Default = Template.bind({});
Default.args = {
    onClearanceHandler: null,
    onClearanceText: "",
};

export const SearchFieldWithClearanceIcon: ComponentStory<typeof SearchField> = (args) => {
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
