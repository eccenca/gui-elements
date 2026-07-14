import React, { useCallback } from "react";
// Blueprint removed: inert passthrough (the former OverlaysProvider context is no longer needed)
const OverlaysProvider = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "storybook/test";

import { helpersArgTypes } from "../../../../.storybook/helpers";

import { MultiSuggestField } from "./MultiSelect";

/**
 * `MultiSelect.tsx` (this folder) is the actual implementation behind the public
 * `MultiSuggestField` component (`src/components/organisms/MultiSuggestField` only re-exports
 * it). This story exercises the component directly via that implementation entry point; see
 * `Forms/MultiSuggestField` for further scenarios (predefined selections, reset buttons, custom
 * search, ...).
 */
export default {
    title: "Forms/MultiSelect",
    component: MultiSuggestField,
    argTypes: {
        items: {
            control: false,
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
            options: ["UNDEFINED", "primary", "success", "warning", "danger"],
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

const colors = ["red", "green", "blue", "yellow", "purple", "orange", "cyan", "magenta"];

const identity = (item: string): string => item;

/** Basic usage over a static list of string items, without the possibility to create new ones. */
export const Default = Template.bind({});
Default.args = {
    items: colors,
    itemId: identity,
    itemLabel: identity,
    openOnKeyDown: true,
};

/** Pre-selects a few of the available items. */
export const PredefinedSelection = Template.bind({});
PredefinedSelection.args = {
    items: colors,
    selectedItems: colors.slice(0, 2),
    itemId: identity,
    itemLabel: identity,
};

/**
 * Allows the user to create new items from the current query when it does not match any of the
 * existing items (via `createNewItemFromQuery`). `isValidNewOption` additionally prevents empty
 * (whitespace-only) items from being created.
 */
export const Createable = Template.bind({});
Createable.args = {
    items: colors,
    itemId: identity,
    itemLabel: identity,
    createNewItemFromQuery: identity,
    isValidNewOption: (query: string) => query.trim().length > 0,
    newItemCreationText: "Add new color",
};

const CustomSearchComponent = (): React.JSX.Element => {
    const searchListPredicate = useCallback(
        (items: string[], query: string) => items.filter((item) => item.toLowerCase().startsWith(query.toLowerCase())),
        [],
    );

    return (
        <OverlaysProvider>
            <MultiSuggestField<string>
                items={colors}
                itemId={identity}
                itemLabel={identity}
                searchListPredicate={searchListPredicate}
                placeholder="Type the beginning of a color name..."
            />
        </OverlaysProvider>
    );
};

/** Uses `searchListPredicate` to only match items whose label starts with the current query. */
export const CustomSearch = CustomSearchComponent.bind({});
