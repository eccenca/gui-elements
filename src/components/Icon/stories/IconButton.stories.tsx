import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
    IconButton,
} from "../../../index";
import canonicalIcons from "./../canonicalIconNames";

export default {
    title: "Components/IconButton",
    component: IconButton,
    argTypes: {
        name: {
            control: "select",
            options: [...(Object.keys(canonicalIcons))],
        },
    },
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (args) => (
    <IconButton {...args} text={args.name?.toString()}/>
);

export const Default = Template.bind({});
Default.args = {
    name: "item-moremenu"
}
