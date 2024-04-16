import React, { useCallback, useMemo, useState } from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { MultiSelectSelectionProps, MultiSuggestField } from "./../../../index";

export default {
    title: "Forms/MultiSuggestField",
    component: MultiSuggestField,
    argTypes: {
        items: {
            control: "none",
        },
    },
} as Meta<typeof MultiSuggestField>;

const Template: StoryFn<typeof MultiSuggestField> = (args) => (
    <div>
        <MultiSuggestField {...args} />
    </div>
);

const testLabels = loremIpsum({
    p: 1,
    avgSentencesPerParagraph: 5,
    avgWordsPerSentence: 1,
    startWithLoremIpsum: false,
    random: false,
})
    .toString()
    .split(".");

const items = new Array(5).fill(undefined).map((_, id) => {
    const testLabel = testLabels[id];
    return { testLabel, testId: `${testLabel}-id` };
});

export const Default = Template.bind({});
Default.args = {
    items,
    canCreateNewItem: true,
    prePopulateWithItems: false,
    itemId: (item) => item.testId,
    itemLabel: (item) => item.testLabel,
    openOnKeyDown: true,
};

/**
 * Display always the dropdown after the element was clicked on.
 * Do not wait until the query input was startet.
 */
export const dropdownOnFocus = Template.bind({});
dropdownOnFocus.args = {
    items,
    canCreateNewItem: true,
    prePopulateWithItems: false,
    itemId: (item) => item.testId,
    itemLabel: (item) => item.testLabel,
    noResultText: "No result.",
};

const selectedItems = items.slice(1, 3);

/**
 * Set the default selected values from the client code.
 */
export const predefinedValues = Template.bind({});
predefinedValues.args = {
    items,
    selectedItems,
    prePopulateWithItems: false,
    itemId: (item) => item.testId,
    itemLabel: (item) => <span data-testid={`${item.testLabel.trim()}`}>{item.testLabel}</span>,
};

/**
 * New item creation, add to a existing list
 */
export const newItemCreation = Template.bind({});
newItemCreation.args = {
    items,
    createNewItemFromQuery: (query) => ({ testId: `${query}-id`, testLabel: query }),
    prePopulateWithItems: false,
    itemId: (item) => item.testId,
    itemLabel: (item) => item.testLabel,
};

const CreationTemplate: StoryFn = () => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const empty = useMemo<string[]>(() => [], []);

    const identity = useCallback((item: string): string => item, []);

    const handleOnSelect = useCallback((params: MultiSelectSelectionProps<string>) => {
        const selected = params.selectedItems;

        setSelectedValues(selected);
    }, []);

    return (
        <MultiSuggestField<string>
            items={empty}
            selectedItems={selectedValues}
            onSelection={handleOnSelect}
            itemId={identity}
            itemLabel={identity}
            createNewItemFromQuery={identity}
            prePopulateWithItems
        />
    );
};

/**
 * Completely create all items from quieries
 */
export const buildItemsFromQuery = CreationTemplate.bind({});
