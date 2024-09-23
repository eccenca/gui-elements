import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Button, Divider } from "./../../../../index";
export default {
    title: "Components/Separation/Divider",
    component: Divider,
    argTypes: {},
} as Meta<typeof Divider>;

// buttons used for only showing space with elements
const DividerExample: StoryFn<typeof Divider> = (args) => (
    <>
        <Button children="Example element" />
        <Divider {...args} />
        <Button children="Another element" />
    </>
);

export const Default = DividerExample.bind({});
Default.args = {};
