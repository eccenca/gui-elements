import React from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../_shadcn/ui/tooltip";
import { cn } from "../../common/utils/cn";

const formatter = new Intl.NumberFormat("en-US");

export interface ContextRingProps {
    /** Tokens already consumed in the context window. */
    usedTokens: number;
    /** Total size of the context window. */
    maxTokens: number;
    /**
     * Accessible label for the ring. Defaults to an English sentence built from
     * the token counts; pass a translated string to localize.
     */
    ariaLabel?: string;
    /**
     * Tooltip body. Defaults to two English lines (tokens used, percent of
     * window); pass translated content to localize.
     */
    tooltip?: React.ReactNode;
}

/**
 * A compact SVG donut visualizing how much of an LLM context window is used.
 * Turns amber at 70% and destructive at 90%.
 */
export function ContextRing({ usedTokens, maxTokens, ariaLabel, tooltip }: ContextRingProps) {
    const pct = maxTokens > 0 ? Math.min(usedTokens / maxTokens, 1) : 0;
    const pctLabel = Math.round(pct * 100);

    const size = 18;
    const stroke = 2.5;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - pct);

    const colorClass = pct >= 0.9 ? "text-destructive" : pct >= 0.7 ? "text-warning" : "text-muted-foreground";
    const used = formatter.format(usedTokens);
    const max = formatter.format(maxTokens);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        aria-label={ariaLabel ?? `Context window: ${used} of ${max} tokens used (${pctLabel}%)`}
                        className={cn("inline-flex items-center justify-center", colorClass)}
                        role="img"
                    >
                        <svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                fill="none"
                                r={radius}
                                stroke="currentColor"
                                strokeOpacity={0.2}
                                strokeWidth={stroke}
                            />
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                fill="none"
                                r={radius}
                                stroke="currentColor"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                                strokeWidth={stroke}
                                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                            />
                        </svg>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {tooltip ?? (
                        <div className="flex flex-col gap-0.5">
                            <span>{`${used} / ${max} tokens`}</span>
                            <span className="opacity-70">{`${pctLabel}% of context window`}</span>
                        </div>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
