import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { LogoReact } from "@carbon/icons-react";
import { Meta, StoryFn } from "@storybook/react";

import { IconButton, TestIcon } from "../../../../index";

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
} as Meta<typeof IconButton>;

const Template: StoryFn<typeof IconButton> = (args) => (
    <OverlaysProvider>
        <IconButton {...args} />
    </OverlaysProvider>
);

export const Default = Template.bind({});
Default.args = {
    name: "item-moremenu",
    text: "Tooltip text",
};
