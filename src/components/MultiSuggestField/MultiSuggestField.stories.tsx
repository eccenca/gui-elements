import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { MultiSuggestField } from "./../../../index";

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
};
