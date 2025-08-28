import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { ChatContent, Depiction, HtmlContentBlock, Icon, OverflowText } from "../../../index";

import canonicalIcons from "./../../Icon/canonicalIconNames";

const allIcons = new Map([
    ...Object.keys(canonicalIcons).map((keyId) => {
        return [`Icon: ${keyId}`, <Depiction image={<Icon name={keyId} />} />];
    }),
]);

const exampleImages = {
    None: undefined,
    ...Object.fromEntries(allIcons),
};

export default {
    title: "Components/Chat/ChatContent",
    component: ChatContent,
    argTypes: {
        avatar: {
            control: "select",
            options: Object.keys(exampleImages),
            mapping: exampleImages,
        },
    },
} as Meta<typeof ChatContent>;

let update = 0;
const TemplateFull: StoryFn<typeof ChatContent> = (args) => <ChatContent {...args} key={update++} />;

export const Default = TemplateFull.bind({});
Default.args = {
    children: (
        <HtmlContentBlock>
            <LoremIpsum p={1} avgSentencesPerParagraph={5} random={false} />
        </HtmlContentBlock>
    ),
    avatar: <Depiction image={<Icon name={"application-useraccount"} />} />,
    statusLine: (
        <OverflowText>
            <strong>Username</strong> 25 minutes ago
        </OverflowText>
    ),
    onToggleSize: undefined,
};

export const LongChatBubble = TemplateFull.bind({});
LongChatBubble.args = {
    ...Default.args,
    children: (
        <HtmlContentBlock>
            <LoremIpsum p={10} avgSentencesPerParagraph={10} random={false} />
        </HtmlContentBlock>
    ),
    limitHeight: true,
};
