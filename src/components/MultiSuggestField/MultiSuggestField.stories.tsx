import React, { useCallback, useMemo, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";

import { MultiSelectSelectionProps, MultiSuggestField } from "./../../../index";
import { items, TestComponent } from "./tests/constants";

export default {
    title: "Forms/MultiSuggestField",
    component: MultiSuggestField,
    argTypes: {
        items: {
            control: "none",
        },
    },
} as Meta<typeof MultiSuggestField>;

const Template: StoryFn<typeof MultiSuggestField> = (args) => {
    return (
        <div>
            <MultiSuggestField {...args} />
        </div>
    );
};

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

export const predefinedNotControlledValues = Template.bind({});
predefinedNotControlledValues.args = {
    items,
    selectedItems,
    prePopulateWithItems: false,
    onSelection: undefined,
    itemId: (item) => item.testId,
    itemLabel: (item) => item.testLabel,
};

/**
 * New item creation, add to a existing list
 */
export const uncontrolledNewItemCreation = Template.bind({});
uncontrolledNewItemCreation.args = {
    items,
    createNewItemFromQuery: (query) => ({ testId: `${query}-id`, testLabel: query }),
    prePopulateWithItems: false,
    itemId: (item) => item.testId,
    itemLabel: (item) => item.testLabel,
};

const CreationTemplate: StoryFn = () => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const items = useMemo<string[]>(() => ["foo", "bar", "baz"], []);

    const identity = useCallback((item: string): string => item, []);

    const handleOnSelect = useCallback((params: MultiSelectSelectionProps<string>) => {
        const selected = params.selectedItems;

        setSelectedValues(selected);
    }, []);

    return (
        <MultiSuggestField<string>
            items={items}
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
export const conrolledNewItemCreation = CreationTemplate.bind({});

const WithResetButton: StoryFn = () => {
    return <TestComponent />;
};

/**
 * Reset values
 */
export const withResetItemAndCreation = WithResetButton.bind({});
