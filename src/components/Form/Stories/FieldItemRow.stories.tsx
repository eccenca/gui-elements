import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import FieldItem from "../FieldItem";
import FieldItemRow from "../FieldItemRow";

import { Default as FieldItemStory } from "./FieldItem.stories";

export default {
    title: "Forms/FieldItemRow",
    component: FieldItemRow,
    argTypes: {
        children: {
            control: "none",
            description: "Elements to include into the Accordion component",
        },
    },
} as Meta<typeof FieldItemRow>;

const Template: StoryFn<typeof FieldItemRow> = (args) => <FieldItemRow {...args} />;
export const Default = Template.bind({});
Default.args = {
    children: [
        <>
            <FieldItem {...FieldItemStory.args} />
            <FieldItem {...FieldItemStory.args} />
            <FieldItem {...FieldItemStory.args} />
        </>,
    ],
};
