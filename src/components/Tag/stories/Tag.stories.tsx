import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof Tag>;

const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: "Tag label",
    small: false,
    onClick: undefined,
    onRemove: undefined,
};
