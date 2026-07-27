/**
 * The composer's submit/stop button. Reflects the `ChatStatus` as a single stable "busy"
 * indicator (with a short trailing delay so it doesn't flicker across the agentic
 * submitted/ready/streaming cycle), and can optionally pulse to draw attention.
 */
import type { ComponentProps } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { CornerDownLeftIcon, Loader, XIcon } from "lucide-react";

import { InputGroupButton } from "@/_shadcn/ui/input-group";
import { cn } from "@/common/utils/cn";

import type { ChatStatus } from "../types";

export type PromptInputSubmitProps = ComponentProps<typeof InputGroupButton> & {
    status?: ChatStatus;
    onStop?: () => void;
    // Pulse the button to signal a freshly finished response awaiting the user.
    attention?: boolean;
    /** Accessible label for the button in its idle/submit state. @default "Submit" */
    submitLabel?: string;
    /** Accessible label for the button while busy (a click stops generation). @default "Stop" */
    stopLabel?: string;
};

export const PromptInputSubmit = ({
    className,
    variant = "default",
    size = "icon-sm",
    submitLabel = "Submit",
    stopLabel = "Stop",
    status,
    onStop,
    attention,
    onClick,
    children,
    ...props
}: PromptInputSubmitProps) => {
    const isGenerating = status === "submitted" || status === "streaming";

    // The agentic tool loop cycles status through submitted/ready/streaming
    // between steps. Holding a single "busy" state (with a short trailing delay)
    // keeps one stable indicator so it doesn't flicker across those transitions.
    const [busy, setBusy] = useState(isGenerating);
    useEffect(() => {
        if (isGenerating) {
            setBusy(true);
            return;
        }
        const timeout = setTimeout(() => setBusy(false), 250);
        return () => clearTimeout(timeout);
    }, [isGenerating]);

    let Icon = <CornerDownLeftIcon className="size-4" />;

    if (busy) {
        Icon = <Loader className="animate-spin" />;
    } else if (status === "error") {
        Icon = <XIcon className="size-4" />;
    }

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            if (busy && onStop) {
                e.preventDefault();
                onStop();
                return;
            }
            onClick?.(e);
        },
        [busy, onStop, onClick],
    );

    const pulse = attention && !busy && status !== "error";

    return (
        <InputGroupButton
            aria-label={busy ? stopLabel : submitLabel}
            className={cn(pulse && "animate-pulse ring-2 ring-primary/50", className)}
            onClick={handleClick}
            size={size}
            type={busy && onStop ? "button" : "submit"}
            variant={variant}
            {...props}
        >
            {children ?? Icon}
        </InputGroupButton>
    );
};
