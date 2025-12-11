import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Button, ContextMenu, IconButton, OverviewItemActions } from "./../../../../index";

export default {
    title: "Components/OverviewItem/OverviewItemActions",
    component: OverviewItemActions,
    subcomponents: { Button, IconButton, ContextMenu },
    argTypes: {
        children: {
            control: false,
            description: "User-interactive elements.",
        },
    },
} as Meta<typeof OverviewItemActions>;

const Template: StoryFn<typeof OverviewItemActions> = (args) => <OverviewItemActions {...args}></OverviewItemActions>;

export const Default = Template.bind({});
Default.args = {
    children: [
        <IconButton name="item-remove" text="Remove this item" disruptive />,
        <Button affirmative>Other action</Button>,
    ],
};
