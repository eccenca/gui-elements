import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Link } from "../../../index";

export default {
    title: "Components/Link",
    component: Link,
    argTypes: {
        target: {
            control: "select",
            options: ["_self", "_blank", "_parent", "_top"],
        },
    },
} as Meta<typeof Link>;

const Template: StoryFn<typeof Link> = (args) => <Link {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: "Example link",
    href: "https://example.com/",
};

export const Disabled = Template.bind({});
Disabled.args = {
    children: "Disabled link",
    href: "https://example.com/",
    disabled: true,
};
