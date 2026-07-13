/**
 * Vendored shadcn/ui `message` (June 2026 chat components, style: new-york-v4).
 * Local adaptations: `cn` import path, `React.forwardRef` re-added (React 18 —
 * registry code relies on React-19 ref-as-prop).
 */
import * as React from "react";

import { cn } from "../../common/utils/cn";

const MessageGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => (
        <div ref={ref} data-slot="message-group" className={cn("flex min-w-0 flex-col gap-2", className)} {...props} />
    ),
);
MessageGroup.displayName = "MessageGroup";

export interface MessageProps extends React.ComponentPropsWithoutRef<"div"> {
    align?: "start" | "end";
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(({ className, align = "start", ...props }, ref) => (
    <div
        ref={ref}
        data-slot="message"
        data-align={align}
        className={cn(
            "group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
            className,
        )}
        {...props}
    />
));
Message.displayName = "Message";

const MessageAvatar = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            data-slot="message-avatar"
            className={cn(
                "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8",
                className,
            )}
            {...props}
        />
    ),
);
MessageAvatar.displayName = "MessageAvatar";

const MessageContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            data-slot="message-content"
            className={cn(
                "flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
                className,
            )}
            {...props}
        />
    ),
);
MessageContent.displayName = "MessageContent";

const MessageHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            data-slot="message-header"
            className={cn(
                "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0",
                className,
            )}
            {...props}
        />
    ),
);
MessageHeader.displayName = "MessageHeader";

const MessageFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            data-slot="message-footer"
            className={cn(
                "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end",
                className,
            )}
            {...props}
        />
    ),
);
MessageFooter.displayName = "MessageFooter";

export { MessageGroup, Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader };
