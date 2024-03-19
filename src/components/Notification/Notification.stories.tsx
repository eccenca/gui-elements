import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { Button, HtmlContentBlock, Notification, Spacing } from "../../../index";

export default {
    title: "Components/Notification",
    component: Notification,
    argTypes: {
        message: {
            control: "none",
        },
        icon: {
            ...helpersArgTypes.exampleIcon,
        },
    },
} as ComponentMeta<typeof Notification>;

const TemplateFull: ComponentStory<typeof Notification> = (args) => <Notification {...args} />;

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
        <Button text="Important" hasStateDanger key="b2" />,
    ],
};
