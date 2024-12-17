import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { HoverToggler } from "./../../index";

export default {
    title: "Components/HoverToggler",
    component: HoverToggler,
    argTypes: {},
} as Meta<typeof HoverToggler>;

const Template: StoryFn<typeof HoverToggler> = (args) => <HoverToggler {...args} style={{ height: "auto" }} />;

export const Default = Template.bind({});
Default.args = {
    baseContent: "Base content.",
    hoverContent: (
        <>
            Content
            <br />
            on <a href="#">hover</a>.
        </>
    ),
};
