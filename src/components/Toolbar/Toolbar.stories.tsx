import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import Button from "../Button/Button";
import IconButton from "../Icon/IconButton";
import Spacing from "../Separation/Spacing";

import Toolbar from "./Toolbar";
import ToolbarSection from "./ToolbarSection";

export default {
    title: "Components/Toolbar",
    component: Toolbar,
    subcomponents: {
        ToolbarSection,
    },
    argTypes: {},
} as Meta<typeof Toolbar>;

const Template: StoryFn<typeof Toolbar> = (args) => (
    <Toolbar {...args}>
        <ToolbarSection>
            <IconButton name="operation-undo" />
            <IconButton name="operation-redo" />
            <Spacing size="tiny" vertical={!args.verticalStack} hasDivider />
            <IconButton name="item-copy" />
        </ToolbarSection>
        <ToolbarSection canGrow />
        <Spacing size="tiny" vertical={!args.verticalStack} />
        <ToolbarSection>
            <IconButton name="item-remove" disruptive />
            <Button text="Save" affirmative />
        </ToolbarSection>
    </Toolbar>
);

export const Default = Template.bind({});

Default.args = {
    verticalStack: false,
    noWrap: false,
};
