import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";

import { Tooltip } from "../../index";

export default {
    title: "Components/Tooltip",
    component: Tooltip,
    argTypes: {},
} as Meta<typeof Tooltip>;

const Template: StoryFn<typeof Tooltip> = (args) => (
    <OverlaysProvider>
        <Tooltip {...args} />
    </OverlaysProvider>
);

const testContent = loremIpsum({
    p: 1,
    avgSentencesPerParagraph: 2,
    random: false,
}).toString();

/**
 * Do not use empty `() => {}` functions as handler values.
 * This is basically an `undefined` but Storybook is currently not able to display this correctly.
 * @see https://github.com/storybookjs/storybook/issues/22930#issuecomment-1579741485
 * */
export const Default = Template.bind({});
Default.args = {
    children: <span>hover me</span>,
    content: testContent,
    addIndicator: true,
};

export const MarkdownSupport = Template.bind({});
MarkdownSupport.args = {
    ...Default.args,
    content: "### This is a headline" + "\n\n" + testContent,
};
