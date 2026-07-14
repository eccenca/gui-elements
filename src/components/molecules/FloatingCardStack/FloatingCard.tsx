import { ChevronDown, Pin } from "lucide-react";
import { type ReactNode } from "react";

import { Button } from "@/_shadcn/ui/button";
import { cn } from "@/common/utils/cn";

export interface FloatingCardProps {
    /** Whether the card is currently expanded inside its stack. */
    expanded: boolean;
    /** Title shown in the card's slim header bar. */
    title: string;
    /** Optional leading icon element for the header bar. */
    icon?: ReactNode;
    /** Whether the card is pinned (pinned cards ignore click-outside collapse). */
    pinned?: boolean;
    /** When set, a pin toggle is rendered in the expanded header. */
    onTogglePin?: () => void;
    onCollapse: () => void;
    children: ReactNode;
    /** Aria label of the pin toggle while pinned. English default; pass a translation to localize. */
    unpinLabel?: string;
    /** Aria label of the pin toggle while unpinned. English default; pass a translation to localize. */
    pinLabel?: string;
    /**
     * Aria label of the collapse button. `{{title}}` defaults are interpolated
     * by the caller; the default is "Collapse <title>".
     */
    collapseLabel?: string;
}

/**
 * The card chrome used inside a `FloatingCardStack`: a slim header bar with
 * title, optional pin toggle and a collapse chevron, above a fill-height body.
 * Companion to `FloatingCardStack`, which supplies the expand/pin state via
 * its `render(state)` callback.
 */
export function FloatingCard({
    expanded,
    title,
    icon,
    pinned,
    onTogglePin,
    onCollapse,
    children,
    unpinLabel = "Allow closing on click outside",
    pinLabel = "Keep open",
    collapseLabel,
}: FloatingCardProps) {
    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-background shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
            <div className="flex h-7 shrink-0 items-center gap-1.5 border-b px-2 text-xs font-medium text-muted-foreground">
                {icon}
                <span className="min-w-0 flex-1 truncate">{title}</span>
                {expanded ? (
                    <div className="-mr-1 flex items-center gap-0.5">
                        {onTogglePin ? (
                            <Button
                                aria-label={pinned ? unpinLabel : pinLabel}
                                aria-pressed={pinned}
                                className={cn("h-5 w-5", pinned && "text-foreground")}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTogglePin();
                                }}
                                size="icon"
                                type="button"
                                variant="ghost"
                            >
                                <Pin className={cn("size-3.5", pinned ? "fill-current" : "rotate-45")} />
                            </Button>
                        ) : null}
                        <Button
                            aria-label={collapseLabel ?? `Collapse ${title}`}
                            className="h-5 w-5"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCollapse();
                            }}
                            size="icon"
                            type="button"
                            variant="ghost"
                        >
                            <ChevronDown className="size-3.5" />
                        </Button>
                    </div>
                ) : null}
            </div>
            <div className="min-h-0 flex-1">{children}</div>
        </div>
    );
}
