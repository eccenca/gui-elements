import React, { useCallback, useMemo, useState } from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "@storybook/test";

import { MultiSuggestField, MultiSuggestFieldSelectionProps, SimpleDialog } from "./../../../index";

const testLabels = loremIpsum({
    p: 1,
    avgSentencesPerParagraph: 5,
    avgWordsPerSentence: 1,
    startWithLoremIpsum: false,
    random: false,
})
    .toString()
    .split(".")
    .map((item) => item.trim());

const items = new Array(5).fill(undefined).map((_, id) => {
    const testLabel = testLabels[id];
    return { testLabel, testId: `${testLabel}-id` };
});

export default {
    title: "Forms/MultiSuggestField",
    component: MultiSuggestField,
    argTypes: {
        items: {
            control: "none",
        },
    },
    args: {
        onSelection: fn(),
    },
} as Meta<typeof MultiSuggestField>;

const Template: StoryFn<typeof MultiSuggestField> = (args) => {
    return (
        <OverlaysProvider>
            <MultiSuggestField {...args} />
        </OverlaysProvider>
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

const DeferredSelectionTemplate: StoryFn = () => {
    const initialSelected: Array<{ testId: string; testLabel: string }> = [];
    const [loaded, setLoaded] = useState(false);

    const selected = loaded ? selectedItems : initialSelected;

    const identity = useCallback((item: string): string => item, []);

    return (
        <OverlaysProvider>
            <div>Selected items loaded: {loaded.toString()}</div>

            <br />

            <MultiSuggestField<string>
                items={items.map(({ testId }) => testId)}
                selectedItems={selected.map(({ testId }) => testId)}
                itemId={identity}
                itemLabel={(itemId) => items.find(({ testId }) => testId === itemId)?.testLabel ?? itemId}
                createNewItemFromQuery={(query) => query}
            />

            <br />

            <button onClick={() => setLoaded((prev) => !prev)}>Toggle selected</button>
        </OverlaysProvider>
    );
};

/**
 *
 */
export const deferredSelection = DeferredSelectionTemplate.bind({});

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
    const [selectedValues, setSelectedValues] = useState<string[]>(["foo"]);

    const items = useMemo<string[]>(() => ["foo", "bar", "baz"], []);

    const identity = useCallback((item: string): string => item, []);

    const handleOnSelect = useCallback((params: MultiSuggestFieldSelectionProps<string>) => {
        const selected = params.selectedItems;

        setSelectedValues(selected);
    }, []);

    return (
        <OverlaysProvider>
            <MultiSuggestField<string>
                items={items}
                selectedItems={selectedValues}
                onSelection={handleOnSelect}
                itemId={identity}
                itemLabel={identity}
                createNewItemFromQuery={identity}
            />
        </OverlaysProvider>
    );
};

/**
 * Completely create all items from quieries
 */
export const conrolledNewItemCreation = CreationTemplate.bind({});

const WithResetButtonComponent = (): JSX.Element => {
    const copy: Array<{ testLabel: string; testId: string }> = [items[2]];

    const [selected, setSelected] = useState(copy);

    const handleOnSelect = useCallback((params) => {
        const items = params.selectedItems;
        setSelected(items);
    }, []);

    const handleReset = (): void => {
        setSelected(copy);
    };

    return (
        <OverlaysProvider>
            <button onClick={handleReset}>Reset</button>
            <br />
            <br />
            <MultiSuggestField<{ testLabel: string; testId: string }>
                items={items}
                selectedItems={selected}
                onSelection={handleOnSelect}
                itemId={({ testId }) => testId}
                itemLabel={({ testLabel }) => testLabel}
                createNewItemFromQuery={(query) => ({ testId: `${query}-id`, testLabel: query })}
            />
        </OverlaysProvider>
    );
};

const WithResetButton: StoryFn = () => {
    return <WithResetButtonComponent />;
};

/**
 * Reset values
 */
export const withResetItemAndCreation = WithResetButton.bind({});

const WithinModal = (): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);

    const copy: Array<{ testLabel: string; testId: string }> = [items[2]];

    const [selected, setSelected] = useState(copy);

    const handleOnSelect = useCallback((params) => {
        const items = params.selectedItems;
        setSelected(items);
    }, []);

    const handleReset = (): void => {
        setSelected(copy);
    };

    return (
        <OverlaysProvider>
            <button onClick={() => setIsOpen(true)}>open modal</button>

            <SimpleDialog isOpen={isOpen} onClose={() => setIsOpen(false)} canOutsideClickClose>
                <div>
                    <button onClick={handleReset}>Reset</button>
                    <br />
                    <br />
                    <MultiSuggestField<{ testLabel: string; testId: string }>
                        items={items}
                        selectedItems={selected}
                        onSelection={handleOnSelect}
                        itemId={({ testId }) => testId}
                        itemLabel={({ testLabel }) => testLabel}
                        createNewItemFromQuery={(query) => ({ testId: `${query}-id`, testLabel: query })}
                    />
                </div>
            </SimpleDialog>
        </OverlaysProvider>
    );
};

export const withinModal = WithinModal.bind({});

/** With custom search function */
export const CustomSearch = Template.bind({});
CustomSearch.args = {
    items,
    prePopulateWithItems: false,
    itemId: (item) => item.testId,
    itemLabel: (item) => item.testLabel,
    searchPredicate: (item, query) => {
        return item.testId.toLowerCase().includes(query) || item.testLabel.toLowerCase().includes(query);
    },
};
