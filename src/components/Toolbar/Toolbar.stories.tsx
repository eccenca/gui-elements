import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Toolbar from "./Toolbar";
import ToolbarSection from "./ToolbarSection";
import Button from "../Button/Button";
import IconButton from "../Icon/IconButton"
import Spacing from "../Separation/Spacing";

export default {
  title: "Components/Toolbar",
  component: Toolbar,
  subcomponents: {
    ToolbarSection,
  },
  argTypes: {},
} as ComponentMeta<typeof Toolbar>;

const Template: ComponentStory<typeof Toolbar> = (args) => (
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
