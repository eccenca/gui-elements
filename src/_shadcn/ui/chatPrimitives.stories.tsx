import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { FileTextIcon, InfoIcon, XIcon } from "lucide-react";

import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentGroup,
    AttachmentMedia,
    AttachmentTitle,
} from "./attachment";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "./bubble";
import { Marker, MarkerContent, MarkerIcon } from "./marker";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "./message";
import { Spinner } from "./spinner";

export default {
    title: "shadcn primitives/Chat (June 2026)",
    component: Message,
} as Meta<typeof Message>;

/** The four June-2026 chat primitives composed into a small transcript. */
const TemplateTranscript: StoryFn = () => (
    <div className="mx-auto flex w-96 flex-col gap-6 rounded-lg border bg-card p-4">
        <Marker variant="separator">
            <MarkerContent>Today</MarkerContent>
        </Marker>

        <Message>
            <MessageAvatar>🤖</MessageAvatar>
            <MessageContent>
                <MessageHeader>Assistant</MessageHeader>
                <BubbleGroup>
                    <Bubble variant="muted">
                        <BubbleContent>Hi! Upload a file and I&apos;ll map it for you.</BubbleContent>
                    </Bubble>
                    <Bubble variant="muted">
                        <BubbleContent>Any CSV, JSON or XML source works.</BubbleContent>
                        <BubbleReactions>👍</BubbleReactions>
                    </Bubble>
                </BubbleGroup>
            </MessageContent>
        </Message>

        <Message align="end">
            <MessageContent>
                <Bubble variant="default" align="end">
                    <BubbleContent>Here is the orders export.</BubbleContent>
                </Bubble>
                <AttachmentGroup>
                    <Attachment state="uploading" size="sm">
                        <AttachmentMedia>
                            <Spinner />
                        </AttachmentMedia>
                        <AttachmentContent>
                            <AttachmentTitle>orders-2026.csv</AttachmentTitle>
                            <AttachmentDescription>1.2 MB — uploading…</AttachmentDescription>
                        </AttachmentContent>
                        <AttachmentActions>
                            <AttachmentAction aria-label="Cancel upload">
                                <XIcon />
                            </AttachmentAction>
                        </AttachmentActions>
                    </Attachment>
                    <Attachment state="done" size="sm">
                        <AttachmentMedia>
                            <FileTextIcon />
                        </AttachmentMedia>
                        <AttachmentContent>
                            <AttachmentTitle>schema.json</AttachmentTitle>
                            <AttachmentDescription>4 KB</AttachmentDescription>
                        </AttachmentContent>
                    </Attachment>
                </AttachmentGroup>
                <MessageFooter>Sent 09:41</MessageFooter>
            </MessageContent>
        </Message>

        <Marker>
            <MarkerIcon>
                <InfoIcon />
            </MarkerIcon>
            <MarkerContent>Assistant is analyzing the file…</MarkerContent>
        </Marker>
    </div>
);

export const ChatTranscript = TemplateTranscript.bind({});

const TemplateBubbleVariants: StoryFn = () => (
    <div className="flex w-80 flex-col gap-3">
        {(["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"] as const).map((variant) => (
            <Bubble key={variant} variant={variant}>
                <BubbleContent>{variant}</BubbleContent>
            </Bubble>
        ))}
    </div>
);

export const BubbleVariants = TemplateBubbleVariants.bind({});

/** MessageGroup keeps consecutive turns of the same author visually grouped. */
const TemplateGrouped: StoryFn = () => (
    <MessageGroup className="w-96">
        <Message>
            <MessageContent>
                <Bubble variant="muted">
                    <BubbleContent>First message</BubbleContent>
                </Bubble>
            </MessageContent>
        </Message>
        <Message>
            <MessageContent>
                <Bubble variant="muted">
                    <BubbleContent>Follow-up from the same author</BubbleContent>
                </Bubble>
            </MessageContent>
        </Message>
    </MessageGroup>
);

export const GroupedMessages = TemplateGrouped.bind({});
