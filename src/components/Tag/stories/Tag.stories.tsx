import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tag } from "./../../../../index";
import { helpersArgTypes } from "../../../../.storybook/helpers";

export default {
    title: "Components/Tag",
    component: Tag,
    argTypes: {
        icon: {
            ...helpersArgTypes.exampleIcon,
        },
        backgroundColor: {
            control: "color",
        },
        onClick: {
            ...helpersArgTypes.handlerOnClick,
        },
        onRemove: {
            ...helpersArgTypes.handlerOnClick,
        },
        emphasized: { control: "none" },
    },
} as ComponentMeta<typeof Tag>;

const Template: ComponentStory<typeof Tag> = (args) => (
  <Tag {...args} />
);

export const Single = Template.bind({});
Single.args = {
    children: "Tag label",
    small: false,
};
