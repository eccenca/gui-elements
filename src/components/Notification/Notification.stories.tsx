import React from "react";
import { LoremIpsum, loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "storybook/test";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { Markdown } from "../../cmem";
import { Button, HtmlContentBlock, Link, Notification, Spacing } from "../../components";

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
        <>
            <HtmlContentBlock>
                <LoremIpsum p={1} avgSentencesPerParagraph={1} random={false} />
                <LoremIpsum p={1} avgSentencesPerParagraph={4} random={false} />
            </HtmlContentBlock>
            <br />
            <Markdown
                htmlContentBlockProps={{
                    style: {
                        maxHeight: "25vh",
                        overflow: "auto",
                    },
                }}
            >
                {"```\n" + loremIpsum({ random: false }) + "\n```"}
            </Markdown>
        </>
    ),
    onDismiss: false, // workaround for undefined function in Storybook
    actions: [<></>],
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

const reviewChanges = fn((event: React.MouseEvent) => event.preventDefault()).mockName("Review changes");

export const ActionsInNarrowContainers: StoryFn<typeof Notification> = () => {
    const message = "Changes made by an agent awaiting your review: 1";
    const previewStyle = { width: "16rem", maxWidth: "100%" };

    return (
        <>
            <p>
                In a narrow card, a button beside the warning takes up much of the space for the message. Put the review
                link on its own line below the message so the warning can use the full width next to the icon.
            </p>
            <Spacing size="small" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <div style={previewStyle}>
                    <h3>Button beside the message</h3>
                    <Spacing size="tiny" />
                    <Notification
                        intent="warning"
                        flexWidth
                        message={message}
                        actions={<Button href="#review-changes" onClick={reviewChanges} text="Review changes" />}
                    />
                </div>
                <div style={previewStyle}>
                    <h3>Link below the message</h3>
                    <Spacing size="tiny" />
                    <Notification intent="warning" flexWidth>
                        <div>{message}</div>
                        <Link href="#review-changes" onClick={reviewChanges}>
                            Review changes
                        </Link>
                    </Notification>
                </div>
            </div>
        </>
    );
};
ActionsInNarrowContainers.parameters = { controls: { disable: true } };
