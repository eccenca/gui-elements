import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../../.storybook/helpers";
import { FieldItem, FieldItemRow, FieldSet, TitleSubsection } from "../../../../index";

import { Default as SimpleFieldItemExample } from "./FieldItem.stories";
import { Default as SimpleFieldItemRowExample } from "./FieldItemRow.stories";

export default {
    title: "Forms/FieldSet",
    component: FieldSet,
    argTypes: {
        children: {
            control: "none",
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
        },
    },
} as Meta<typeof FieldSet>;

const Template: StoryFn<typeof FieldSet> = (args) => <FieldSet {...args} />;
export const Default = Template.bind({});
Default.args = {
    title: <TitleSubsection>Fieldset title</TitleSubsection>,
    children: [<FieldItem {...SimpleFieldItemExample.args} />, <FieldItemRow {...SimpleFieldItemRowExample.args} />],
    messageText: <LoremIpsum p={1} avgSentencesPerParagraph={2} random={false} />,
    helperText: <LoremIpsum p={1} avgSentencesPerParagraph={1} random={false} />,
};
