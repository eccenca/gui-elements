import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof CardTitle>;

const Template: ComponentStory<typeof CardTitle> = (args) => <CardTitle {...args} />;

export const Default = Template.bind({});
Default.args = {
    narrowed: false,
    children: <h2>Card title</h2>,
};
