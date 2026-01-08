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
