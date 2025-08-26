import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { ChatContent, Depiction, Icon, OverflowText } from "../../../index";

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
    title: "Components/Chat",
    component: ChatContent,
    argTypes: {
        avatar: {
            control: "select",
            options: Object.keys(exampleImages),
            mapping: exampleImages,
        },
    },
} as Meta<typeof ChatContent>;

const TemplateFull: StoryFn<typeof ChatContent> = (args) => <ChatContent {...args} />;

export const Default = TemplateFull.bind({});
Default.args = {
    children: <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />,
    avatar: <Depiction image={<Icon name={"application-useraccount"} />} />,
    statusLine: (
        <OverflowText>
            <strong>Username</strong> 25 minutes ago
        </OverflowText>
    ),
};
