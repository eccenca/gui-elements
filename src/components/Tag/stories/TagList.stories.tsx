import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Tag, TagList } from "./../../../../index";

export default {
    title: "Components/Tag",
    component: TagList,
    argTypes: {
        children: {
            control: false,
        },
    },
} as Meta<typeof TagList>;

const Template: StoryFn<typeof TagList> = (args) => <TagList {...args} />;

export const List = Template.bind({});
List.args = {
    label: "Tag list",
    children: [<Tag small>Short</Tag>, <Tag>List</Tag>, <Tag>Of</Tag>, <Tag large>Tags</Tag>],
};

export const ListWithOverflow = Template.bind({});
ListWithOverflow.args = {
    label: "Tag list with overflow",
    style: { width: '300px' },
    children: [
        <Tag>First Tag</Tag>,
        <Tag>Second Tag</Tag>,
        <Tag>Third Tag</Tag>,
        <Tag>Fourth Tag</Tag>,
        <Tag>Fifth Tag</Tag>,
        <Tag>Sixth Tag</Tag>,
        <Tag>Seventh Tag</Tag>,
        <Tag>Eighth Tag</Tag>,
    ],
};
