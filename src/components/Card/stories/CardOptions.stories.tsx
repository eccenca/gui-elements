import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import IconButton from "../../Icon/IconButton";
import { CardOptions } from "../index";

export default {
    title: "Components/Card/CardOptions",
    component: CardOptions,
    argTypes: {
        children: {
            control: "none",
            description: "Elements for user-interaction.",
        },
    },
} as Meta<typeof CardOptions>;

const Template: StoryFn<typeof CardOptions> = (args) => <CardOptions {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: <IconButton name="item-question" onClick={() => alert("Some action is triggered")} />,
};
