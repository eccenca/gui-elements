import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { highlighterUtils, SuggestField, SuggestFieldProps, suggestFieldUtils } from "../../index";

const SuggestFieldStory: Meta<typeof SuggestField> = {
    title: "Forms/SuggestField",
    component: SuggestField,
    argTypes: {},
};

const Template: StoryFn<typeof SuggestField> = (args) => <SuggestField {...args}></SuggestField>;

// Renders string values as string
const defaultRenderer = (item: string) => item;

export const Default = Template.bind({});
const defaultArgs: SuggestFieldProps<string, string> = {
    itemRenderer: (item: string) => `Rendered item: ${item}`,
    itemValueRenderer: (item: string) => `Selected item: ${item}`,
    itemValueString: (item: string) => `Query: ${item}`,
    onSearch: (query: string) => {
        const multiWord = highlighterUtils.extractSearchWords(query, true);
        return ["search item A", "search element B", "search object C"].filter((word) =>
            highlighterUtils.matchesAllWords(word.toLowerCase(), multiWord)
        );
    },
    onChange: (elem) => {
        console.log(`Entry '${elem}' selected!`);
    },
    itemValueSelector: defaultRenderer,
    noResultText: "No result",
    //fill: false,
    onlyDropdownWithQuery: true,
};
Default.args = defaultArgs;

/**
 * Display always the dropdown after the element has the focus.
 * Do not wait until the query input was startet.
 */
export const DropdownOnFocus = Template.bind({});
const dropdownOnFocus: SuggestFieldProps<string, string> = {
    ...defaultArgs,
    onlyDropdownWithQuery: false,
};
DropdownOnFocus.args = dropdownOnFocus;

/**
 * Changes the search query for the selected item, e.g. when the rendered item text should be different from the query finding this item.
 */
export const AdaptQueryAfterSelection = Template.bind({});
const adaptQueryAfterSelection: SuggestFieldProps<string, string> = {
    ...defaultArgs,
    resetQueryToValue: (selectedValue: string) => selectedValue,
};
AdaptQueryAfterSelection.args = adaptQueryAfterSelection;

/**
 * Allows to reset a selection.
 */
export const AllowReset = Template.bind({});
const resetSelection: SuggestFieldProps<string, string> = {
    ...defaultArgs,
    reset: {
        resetValue: "",
        resetButtonText: "Clear selected value",
        resettableValue: (_value: string) => true,
    },
};
AllowReset.args = resetSelection;

export const AllowCustomValues = Template.bind({});
const allowCustomValues: SuggestFieldProps<string, string> = {
    ...defaultArgs,
    createNewItem: {
        itemRenderer: suggestFieldUtils.createNewItemRendererFactory(
            (query: string) => `Create new item: ${query}`,
            "item-add-artefact"
        ),
        itemFromQuery: (item) => item,
    },
};
AllowCustomValues.args = allowCustomValues;

/**
 * Changes the search query for the selected item, e.g. when the rendered item text should be different from the query finding this item.
 */
export const ReadOnlyState = Template.bind({});
const readOnlyState: SuggestFieldProps<string, string> = {
    ...defaultArgs,
    initialValue: "search item B",
    inputProps: {
        readOnly: true,
    },
};
ReadOnlyState.args = readOnlyState;

export default SuggestFieldStory;
