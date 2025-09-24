import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { Button, HtmlContentBlock, Notification, Spacing } from "../../../index";

export default {
    title: "Components/Notification",
    component: Notification,
    argTypes: {
        message: {
            control: false,
        },
        icon: {
            ...helpersArgTypes.exampleIcon,
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
            options: ["UNDEFINED", "success", "warning", "danger", "neutral", "info"],
        },
    },
} as Meta<typeof Notification>;

const TemplateFull: StoryFn<typeof Notification> = (args) => <Notification {...args} />;

export const ExampleWithMessage = TemplateFull.bind({});
ExampleWithMessage.args = {
    message: <LoremIpsum p={1} avgSentencesPerParagraph={2} random={false} />,
    onDismiss: false, // workaround for undefined function in Storybook
};

export const ExampleWithChildren = TemplateFull.bind({});
ExampleWithChildren.args = {
    children: (
        <HtmlContentBlock>
            <LoremIpsum p={1} avgSentencesPerParagraph={1} random={false} />
            <LoremIpsum p={1} avgSentencesPerParagraph={4} random={false} />
        </HtmlContentBlock>
    ),
    onDismiss: false, // workaround for undefined function in Storybook
};

export const ExampleNeutralMessage = TemplateFull.bind({});
ExampleNeutralMessage.args = {
    message: <LoremIpsum p={1} avgSentencesPerParagraph={2} random={false} />,
    onDismiss: false, // workaround for undefined function in Storybook
    intent: "neutral",
};

export const ExampleWithActions = TemplateFull.bind({});
ExampleWithActions.args = {
    message: <LoremIpsum p={1} avgSentencesPerParagraph={2} random={false} />,
    onDismiss: false, // workaround for undefined function in Storybook
    intent: "danger",
    actions: [
        <Button text="Something" key="b1" />,
        <Spacing size="tiny" vertical />,
        <Button text="Important" intent="danger" key="b2" />,
    ],
};
