import React from "react";
import { LogoReact } from "@carbon/icons-react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { IconButton, TestIcon } from "../../../index";

import canonicalIcons from "./../canonicalIconNames";

export default {
    title: "Components/IconButton",
    component: IconButton,
    argTypes: {
        text: { control: "text" },
        name: {
            control: "select",
            options: ["Test icon", ...Object.keys(canonicalIcons)],
            mapping: {
                "Test icon": <TestIcon tryout={LogoReact} className="testclass-icon" />,
                ...Object.keys(canonicalIcons),
            },
        },
    },
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (args) => <IconButton {...args} />;

export const Default = Template.bind({});
Default.args = {
    name: "item-moremenu",
    text: "Tooltip text",
};
