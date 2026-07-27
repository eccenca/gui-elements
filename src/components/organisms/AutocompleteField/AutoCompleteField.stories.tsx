import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { MenuItem, SuggestField, SuggestFieldProps } from "@/index";

/**
 * `AutoCompleteField.tsx` (this folder) is a deprecated compatibility re-export of the public
 * `SuggestField` component, whose implementation lives in
 * `src/components/organisms/SuggestField/SuggestField`. This story exercises the component via
 * that legacy entry point; see `Forms/SuggestField` for further usage patterns (async search,
 * controlled query reset, ...).
 */
const AutoCompleteFieldStory: Meta<typeof SuggestField> = {
    title: "Forms/AutocompleteField",
    component: SuggestField,
    argTypes: {},
};

const Template: StoryFn<typeof SuggestField> = (args) => <SuggestField {...args} />;

const fruits = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew"];

const defaultArgs: SuggestFieldProps<string, string> = {
    itemRenderer: (item: string) => item,
    itemValueRenderer: (item: string) => item,
    itemValueString: (item: string) => item,
    itemValueSelector: (item: string) => item,
    onSearch: (query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        return fruits.filter((fruit) => fruit.toLowerCase().includes(lowerCaseQuery));
    },
    onChange: (value: string) => {
        console.log(`Selected fruit: ${value}`);
    },
    noResultText: "No matching fruit found",
    onlyDropdownWithQuery: true,
};

/** Basic string based auto-completion, filtering a static list of items with `onSearch`. */
export const Default = Template.bind({});
Default.args = defaultArgs;

/**
 * Allows the current selection to be cleared via a reset button that appears next to the input.
 */
export const AllowReset = Template.bind({});
const allowReset: SuggestFieldProps<string, string> = {
    ...defaultArgs,
    initialValue: "banana",
    reset: {
        resetValue: "",
        resetButtonText: "Clear selected fruit",
        resettableValue: (_value: string) => true,
    },
};
AllowReset.args = allowReset;

/**
 * Renders each option as a custom `MenuItem` (with an icon) instead of relying on the default
 * string representation with search highlighting.
 */
export const CustomItemRenderer = Template.bind({});
const customItemRenderer: SuggestFieldProps<string, string> = {
    ...defaultArgs,
    itemRenderer: (item, _query, modifiers, handleClick) => (
        <MenuItem
            key={item}
            active={modifiers.active}
            disabled={modifiers.disabled}
            icon="artefact-dataset"
            text={item}
            onClick={handleClick}
        />
    ),
};
CustomItemRenderer.args = customItemRenderer;

export default AutoCompleteFieldStory;
