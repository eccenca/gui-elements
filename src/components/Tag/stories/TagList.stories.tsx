import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TagList, Tag } from "./../../../../index";

export default {
    title: "Components/Tag",
    component: TagList,
    argTypes: {
        children: {
            control: "none",
        },
    },
} as ComponentMeta<typeof TagList>;

const Template: ComponentStory<typeof TagList> = (args) => (
  <TagList {...args} />
);

export const List = Template.bind({});
List.args = {
    label: "Tag list",
    children: [
        <Tag>Short</Tag>,
        <Tag>List</Tag>,
        <Tag>Of</Tag>,
        <Tag>Tags</Tag>,
    ]
};
