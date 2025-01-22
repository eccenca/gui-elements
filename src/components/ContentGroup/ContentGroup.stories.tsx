import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Button } from "../Button/Button";

import { ContentGroup } from "./ContentGroup";

export default {
    title: "Components/ContentGroup",
    component: ContentGroup,
    argTypes: {
        handlerToggleCollapse: {
            action: "toggle collapse",
        },
    },
} as Meta<typeof ContentGroup>;

const TemplateFull: StoryFn<typeof ContentGroup> = (args) => <ContentGroup {...args} />;

export const BasicExample = TemplateFull.bind({});
BasicExample.args = {
    title: "Title",
    children: "Content",
    isCollapsed: false,
};

export const Collapsed = TemplateFull.bind({});
Collapsed.args = {
    ...BasicExample.args,
    isCollapsed: true,
};

export const Description = TemplateFull.bind({});
Description.args = {
    ...BasicExample.args,
    description: "Description",
};

export const ActionsOptions = TemplateFull.bind({});
ActionsOptions.args = {
    ...BasicExample.args,
    actionOptions: [<Button key="1">Action 1</Button>],
};
