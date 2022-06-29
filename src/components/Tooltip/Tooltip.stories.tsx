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

export const Default = Template.bind({});
Default.args = {
    children: <span>hover me</span>,
    content: loremIpsum({
        p: 1,
        avgSentencesPerParagraph: 2,
        random: false
    }).toString(),
    addIndicator: true,
    // this is a workaround to prevent empty functions in code example
    onClose: false,
    onClosed: false,
    onClosing: false,
    onInteraction: false,
    onOpened: false,
    onOpening: false,
}
