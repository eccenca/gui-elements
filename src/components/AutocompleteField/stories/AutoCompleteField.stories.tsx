import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { highlighterUtils } from "../../Typography/Highlighter";
import { AutoCompleteField, IAutoCompleteFieldProps } from "../AutoCompleteField";
import { createNewItemRendererFactory } from "../autoCompleteFieldUtils";

const AutoCompleteFieldStory: Meta<typeof AutoCompleteField> = {
    title: "Forms/AutoCompleteField",
    component: AutoCompleteField,
    argTypes: {},
};

const Template: StoryFn<typeof AutoCompleteField> = (args) => <AutoCompleteField {...args}></AutoCompleteField>;

export const Default = Template.bind({});
export const AdaptQueryAfterSelection = Template.bind({});
export const AllowReset = Template.bind({});
export const AllowCustomValues = Template.bind({});
export const ReadOnlyState = Template.bind({});

// Renders string values as string
const defaultRenderer = (item: string) => item;

const defaultArgs: IAutoCompleteFieldProps<string, string> = {
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
};

// Changes the search query for the selected item, e.g. when the rendered item text should be different from the query finding this item.
const adaptQueryAfterSelection: IAutoCompleteFieldProps<string, string> = {
    ...defaultArgs,
    resetQueryToValue: (selectedValue: string) => selectedValue,
};

// Allows to reset a selection
const resetSelection: IAutoCompleteFieldProps<string, string> = {
    ...defaultArgs,
    reset: {
        resetValue: "",
        resetButtonText: "Clear selected value",
        resettableValue: (_value: string) => true,
    },
};

const allowCustomValues: IAutoCompleteFieldProps<string, string> = {
    ...defaultArgs,
    createNewItem: {
        itemRenderer: createNewItemRendererFactory((query: string) => `Create new item: ${query}`, "item-add-artefact"),
        itemFromQuery: (item) => item,
    },
};

// Changes the search query for the selected item, e.g. when the rendered item text should be different from the query finding this item.
const readOnlyState: IAutoCompleteFieldProps<string, string> = {
    ...defaultArgs,
    initialValue: "search item B",
    inputProps: {
        readOnly: true,
    },
};

Default.args = defaultArgs;
AdaptQueryAfterSelection.args = adaptQueryAfterSelection;
AllowReset.args = resetSelection;
AllowCustomValues.args = allowCustomValues;
ReadOnlyState.args = readOnlyState;

export default AutoCompleteFieldStory;
