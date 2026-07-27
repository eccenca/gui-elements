/**
 * Composer-tuned wrappers around the shadcn `HoverCard` primitives (zero open/close
 * delay, start-aligned content by default).
 */
import type { ComponentProps } from "react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/_shadcn/ui/hover-card";

export type PromptInputHoverCardProps = ComponentProps<typeof HoverCard>;

export const PromptInputHoverCard = ({ openDelay = 0, closeDelay = 0, ...props }: PromptInputHoverCardProps) => (
    <HoverCard closeDelay={closeDelay} openDelay={openDelay} {...props} />
);

export type PromptInputHoverCardTriggerProps = ComponentProps<typeof HoverCardTrigger>;

export const PromptInputHoverCardTrigger = (props: PromptInputHoverCardTriggerProps) => <HoverCardTrigger {...props} />;

export type PromptInputHoverCardContentProps = ComponentProps<typeof HoverCardContent>;

export const PromptInputHoverCardContent = ({ align = "start", ...props }: PromptInputHoverCardContentProps) => (
    <HoverCardContent align={align} {...props} />
);
