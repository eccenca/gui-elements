import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../../.storybook/helpers";

import { Tag } from "./../../../../index";

export default {
    title: "Components/Tag",
    component: Tag,
    argTypes: {
        icon: {
            ...helpersArgTypes.exampleIcon,
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
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
} as Meta<typeof Tag>;

const Template: StoryFn<typeof Tag> = (args) => <Tag {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: "Tag label",
    small: false,
    onClick: undefined,
    onRemove: undefined,
};
