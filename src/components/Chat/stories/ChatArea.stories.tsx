import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { ChatArea, ChatContent, ChatContentCollapsed, ChatField } from "../../../index";

import { Default as ShortChatBubble, LongChatBubble } from "./ChatContent.stories";
import { Default as ChatFieldExample } from "./ChatField.stories";

export default {
    title: "Components/Chat/ChatArea",
    component: ChatArea,
    argTypes: {},
} as Meta<typeof ChatArea>;

let forceupdate = 0;
const TemplateFull: StoryFn<typeof ChatArea> = (args) => (
    <div style={args.useAbsoluteSpace ? { position: "relative", height: "75vh" } : undefined}>
        <ChatArea {...args} key={forceupdate++} />
    </div>
);

export const Default = TemplateFull.bind({});
Default.args = {
    chatField: <ChatField {...ChatFieldExample.args} />,
    children: [
        <ChatContent {...ShortChatBubble.args} alignment="right" indentationSize="medium" />,
        <ChatContent {...ShortChatBubble.args} avatar={undefined} displayType="free" />,
        <ChatContent {...ShortChatBubble.args} alignment="right" indentationSize="medium" />,
        <ChatContentCollapsed>
            <ChatContent {...LongChatBubble.args} />
        </ChatContentCollapsed>,
        <ChatContent {...ShortChatBubble.args} alignment="right" indentationSize="medium" />,
        <ChatContent {...ShortChatBubble.args} />,
    ],
    autoSpacingSize: "medium",
    autoScrollTo: "last",
    useAbsoluteSpace: true,
};
