import React from "react";
import {ComponentMeta, ComponentStory} from "@storybook/react";

import {AutoCompleteField, IAutoCompleteFieldProps} from "../AutoCompleteField";
import {extractSearchWords, matchesAllWords} from "../../Typography/Highlighter";
import {createNewItemRendererFactory} from "../autoCompleteFieldUtils";

const AutoCompleteFieldStory: ComponentMeta<typeof AutoCompleteField> = {
    title: "Components/AutoCompleteField",
    component: AutoCompleteField,
    argTypes: {
        noResultText: {
            description: "The text that is shown when no result has been found.",
            control: "text"
        },
        disabled: {
            description: "Disabled the component.",
            control: "boolean"
        },
        autoFocus: {
            description: "Automatically focuses the input field on first render.",
            control: "boolean"
        },
        initialValue: {
            description: "The initial value of the input field.",
            control: "text"
        },
    },
}

const Template: ComponentStory<typeof AutoCompleteField> = (args) => (
    <AutoCompleteField {...args}></AutoCompleteField>
);

export const Default = Template.bind({});
export const AdaptQueryAfterSelection = Template.bind({})
export const AllowReset = Template.bind({})
export const AllowCustomValues = Template.bind({})

// Renders string values as string
const defaultRenderer = (item: string) => item

const defaultArgs: IAutoCompleteFieldProps<string, string> = {
    itemRenderer: (item: string) => `Rendered item: ${item}`,
    itemValueRenderer: (item: string) => `Selected item: ${item}`,
    itemValueString: (item: string) => `Query: ${item}`,
    onSearch: (query: string) => {
        const multiWord = extractSearchWords(query, true)
        return ["search item A", "search element B", "search object C"]
            .filter(word => matchesAllWords(word.toLowerCase(), multiWord))
    },
    onChange: elem => {
        console.log(`Entry '${elem}' selected!`)
    },
    itemValueSelector: defaultRenderer,
    noResultText: "No result"
}

// Changes the search query for the selected item, e.g. when the rendered item text should be different from the query finding this item.
const adaptQueryAfterSelection: IAutoCompleteFieldProps<string, string> = {
    ...defaultArgs,
    resetQueryToValue: (selectedValue: string) => selectedValue
}

// Allows to reset a selection
const resetSelection: IAutoCompleteFieldProps<string, string> = {
    ...defaultArgs,
    reset: {
        resetValue: "",
        resetButtonText: "Clear selected value",
        resettableValue: (value: string) => true
    }
}

const allowCustomValues: IAutoCompleteFieldProps<string, string> = {
    ...defaultArgs,
    createNewItem: {
        itemRenderer: createNewItemRendererFactory(
            (query: string) => `Create new item: ${query}`,
            "item-add-artefact"
        ),
        itemFromQuery: item => item,
    }
}

Default.args = defaultArgs;
AdaptQueryAfterSelection.args = adaptQueryAfterSelection
AllowReset.args = resetSelection
AllowCustomValues.args = allowCustomValues

export default AutoCompleteFieldStory
