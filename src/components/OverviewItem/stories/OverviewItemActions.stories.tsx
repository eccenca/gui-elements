import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Button from "../../Button/Button";
import ContextMenu from "../../ContextOverlay/ContextMenu";
import IconButton from "../../Icon/IconButton";

import OverviewItemActions from "./../OverviewItemActions";

export default {
    title: "Components/OverviewItem/OverviewItemActions",
    component: OverviewItemActions,
    subcomponents: { Button, IconButton, ContextMenu },
    argTypes: {
        children: {
            control: "none",
            description: "User-interactive elements.",
        },
    },
} as ComponentMeta<typeof OverviewItemActions>;

const Template: ComponentStory<typeof OverviewItemActions> = (args) => (
    <OverviewItemActions {...args}></OverviewItemActions>
);

export const Default = Template.bind({});
Default.args = {
    children: [
        <IconButton name="item-remove" tooltip="Remove this item" disruptive />,
        <Button affirmative>Other action</Button>,
    ],
};
