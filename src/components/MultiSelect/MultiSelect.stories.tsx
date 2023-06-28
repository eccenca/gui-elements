import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { MultiSelect as MultiSelectExample } from "./../../../index";

export default {
    title: "Forms/MultiSelect",
    component: MultiSelectExample,
    argTypes: {
        items: {
            control: "none",
        },
    },
} as Meta<typeof MultiSelectExample>;

const Template: StoryFn<typeof MultiSelectExample> = (args) => (
    <div>
        <MultiSelectExample {...args} />
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
};
