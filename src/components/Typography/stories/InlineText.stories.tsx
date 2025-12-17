import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { InlineText } from "../InlineText";

import overflowTextConfig from "./OverflowText.stories";

const config = {
    title: "Components/Typography/InlineText",
    component: InlineText,
    argTypes: {
        children: overflowTextConfig.argTypes?.children,
    },
} as Meta<typeof InlineText>;
export default config;

const Template: StoryFn<typeof InlineText> = (args) => <InlineText {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: (
        <>
            <div>Block line 1</div>
            <div>Block line 2</div>
        </>
    ),
};
