import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { AiElements } from "@/index";

const {
    ChatErrorBoundary,
    ContextRing,
    Conversation,
    ConversationContent,
    ConversationScrollButton,
    Message,
    MessageContent,
    MessageResponse,
    PromptInput,
    PromptInputBody,
    PromptInputFooter,
    PromptInputSubmit,
    PromptInputTextarea,
    Tool,
    ToolContent,
    ToolHeader,
    ToolInput,
    ToolOutput,
} = AiElements;

export default {
    title: "Components/AiElements",
    component: Conversation,
} as Meta<typeof Conversation>;

const assistantReply = [
    "Sure — here is **the plan**:",
    "",
    "1. Inspect the source schema",
    "2. Suggest matching target properties",
    "",
    "```ts",
    "const answer = 42;",
    "```",
].join("\n");

/** A full transcript: user + markdown assistant message, a tool call, the composer below. */
export const ChatTranscript: StoryFn = () => (
    <div className="flex h-[32rem] w-[36rem] flex-col rounded-lg border">
        <Conversation className="min-h-0 flex-1">
            <ConversationContent>
                <Message from="user">
                    <MessageContent>Map orders to schema:Order</MessageContent>
                </Message>
                <Message from="assistant">
                    <MessageContent>
                        <ChatErrorBoundary label="assistant-1">
                            <MessageResponse>{assistantReply}</MessageResponse>
                        </ChatErrorBoundary>
                    </MessageContent>
                </Message>
                <Tool defaultOpen>
                    <ToolHeader type="tool-searchTargetTypes" state="output-available" />
                    <ToolContent>
                        <ToolInput input={{ query: "Order" }} />
                        <ToolOutput output={{ matches: ["schema:Order"] }} errorText={undefined} />
                    </ToolContent>
                </Tool>
            </ConversationContent>
            <ConversationScrollButton />
        </Conversation>
        <div className="border-t p-2">
            <PromptInput onSubmit={() => undefined}>
                <PromptInputBody>
                    <PromptInputTextarea />
                </PromptInputBody>
                <PromptInputFooter>
                    <ContextRing usedTokens={52_000} maxTokens={200_000} />
                    <PromptInputSubmit />
                </PromptInputFooter>
            </PromptInput>
        </div>
    </div>
);

export const ContextRingStates: StoryFn = () => (
    <div className="flex items-center gap-4">
        <ContextRing usedTokens={20_000} maxTokens={200_000} />
        <ContextRing usedTokens={150_000} maxTokens={200_000} />
        <ContextRing usedTokens={190_000} maxTokens={200_000} />
    </div>
);
