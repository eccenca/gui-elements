import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';

import Notification from "./Notification";
import HtmlContentBlock from "./../Typography/HtmlContentBlock";
import Button from "./../Button/Button";
import Spacing from "./../Separation/Spacing";

export default {
    title: "Components/Notification",
    component: Notification,
    argTypes: {
        className: {
            description: "A space-delimited list of class names.",
            control: "text",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "string" },
            }
        },
        onDismiss: {
            description: "Callback invoked when the toast is dismissed, either by the user or by the timeout.",
            control: "none",
            table: {
                defaultValue: { summary: undefined },
                type: { summary: "(didTimeoutExpire: boolean) => void" },
            }
        },
        timeout: {
            description: "Milliseconds to wait before automatically dismissing toast. Providing a value less than or equal to 0 will disable the timeout.",
            control: "number",
            table: {
                defaultValue: { summary: 0 },
                type: { summary: "number" },
            }
        },
        message: {
            control: "none",
        },
    },
} as ComponentMeta<typeof Notification>;

const TemplateFull: ComponentStory<typeof Notification> = (args) => (
    <Notification {...args} />
);

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
    neutral: true,
};

export const ExampleWithActions = TemplateFull.bind({});
ExampleWithActions.args = {
    message: <LoremIpsum p={1} avgSentencesPerParagraph={2} random={false} />,
    onDismiss: false, // workaround for undefined function in Storybook
    danger: true,
    actions: [
        <Button text="Something" key="b1" />,
        <Spacing size="tiny" vertical />,
        <Button text="Important" hasStateDanger key="b2" />
    ]
};
