import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';
import { FieldSet, TitleSubsection, FieldItem, FieldItemRow } from '../../../../index';
import { Default as SimpleFieldItemExample } from "./FieldItem.stories";
import { Default as SimpleFieldItemRowExample } from "./FieldItemRow.stories";

export default {
    title: "Forms/FieldSet",
    component: FieldSet,
    argTypes: {
        children: {
            control: "none",
        },
    }
} as Meta<typeof FieldSet>;

const Template: StoryFn<typeof FieldSet> = (args) => (
    <FieldSet {...args} />
);
export const Default = Template.bind({});
Default.args = {
    title: <TitleSubsection>Fieldset title</TitleSubsection>,
    children: [
        <FieldItem {...SimpleFieldItemExample.args} />,
        <FieldItemRow {...SimpleFieldItemRowExample.args} />
    ],
    messageText: <LoremIpsum p={1} avgSentencesPerParagraph={2} random={false} />,
    helperText: <LoremIpsum p={1} avgSentencesPerParagraph={1} random={false} />,
};
