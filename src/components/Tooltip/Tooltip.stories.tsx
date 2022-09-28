import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { loremIpsum } from "react-lorem-ipsum";

import {
  Tooltip
} from "../../index";

export default {
  title: "Components/Tooltip",
  component: Tooltip,
  argTypes: {
  },
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
    <Tooltip {...args} />
);

const testContent = loremIpsum({
    p: 1,
    avgSentencesPerParagraph: 2,
    random: false
}).toString()

export const Default = Template.bind({});
Default.args = {
    children: <span>hover me</span>,
    content: testContent,
    addIndicator: true,
    // Workaround: setting handlers to false is the only way to prevent Storybook to insert empty handlers in the code examples
    onClose: false,
    onClosing: false,
    //onClosed: false,
    onInteraction: false,
    onOpened: false,
    onOpening: false,
}

export const MarkdownSupport = Template.bind({});
MarkdownSupport.args = {
    ...Default.args,
    content: "### This is a headline" + "\n\n" + testContent,
}
