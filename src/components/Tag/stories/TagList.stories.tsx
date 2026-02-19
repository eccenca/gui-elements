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

export const ListWithOverflow: StoryFn<typeof TagList> = () => (
    <div style={{ maxWidth: "240px", border: "1px solid #ddd", padding: "16px" }}>
        <TagList label="Programming Languages">
            <Tag small>Goooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo</Tag>
            <Tag small>JavaScript</Tag>
            <Tag small>TypeScript</Tag>
            <Tag small>Python</Tag>
            <Tag small>Java</Tag>
            <Tag small>C++</Tag>
            <Tag small>Ruby</Tag>
            <Tag small>Rust</Tag>
        </TagList>
    </div>
);
ListWithOverflow.parameters = {
    docs: {
        description: {
            story: 'When tags exceed the container width, a "+X more" button appears. Hover over it to see all tags in a tooltip.',
        },
    },
};
