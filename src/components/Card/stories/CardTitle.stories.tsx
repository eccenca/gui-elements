import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { CardTitle } from "../index";

export default {
    title: "Components/Card/CardTitle",
    component: CardTitle,
    argTypes: {
        children: {
            control: "none",
            description: "Elements for card title.",
        },
    },
} as Meta<typeof CardTitle>;

const Template: StoryFn<typeof CardTitle> = (args) => <CardTitle {...args} />;

export const Default = Template.bind({});
Default.args = {
    narrowed: false,
    children: <h2>Card title</h2>,
};
