import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { ChatContent, ChatContentCollapsed } from "../../../index";

import { LongChatBubble } from "./ChatContent.stories";

export default {
    title: "Components/Chat/ChatContentCollapsed",
    component: ChatContentCollapsed,
    argTypes: {},
} as Meta<typeof ChatContentCollapsed>;

let update = 0;
const TemplateFull: StoryFn<typeof ChatContentCollapsed> = (args) => (
    <div key={update++}>
        <ChatContentCollapsed {...args} />
    </div>
);

export const Default = TemplateFull.bind({});
Default.args = {
    children: <ChatContent {...LongChatBubble.args} />,
};
