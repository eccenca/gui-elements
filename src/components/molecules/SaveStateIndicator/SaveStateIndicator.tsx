import React from "react";
import { cva } from "class-variance-authority";
import { Check, CircleAlert, CircleDot, Loader2, TriangleAlert } from "lucide-react";

import { cn } from "@/common/utils/cn";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/_shadcn/ui/tooltip";

/**
 * The four mutually exclusive save states the indicator can display.
 *
 * - `saving` — a save request is in flight.
 * - `dirty` — there are unsaved changes; the chip is a button that triggers a save.
 * - `error` — the last save failed; the chip is a button that retries the save.
 * - `saved` — the last save succeeded. Pass {@link SaveStateIndicatorProps.warnings} to
 *   switch this into the "saved with warnings" look.
 */
export type SaveState = "saved" | "saving" | "dirty" | "error";

/** All user-facing strings displayed by the indicator. The consuming app supplies (translated) copy. */
export interface SaveStateIndicatorLabels {
    /** Visible label while saving, e.g. "Saving…". */
    saving: string;
    /** Tooltip shown while saving, e.g. "Saving to backend…". */
    savingTooltip: string;
    /** Visible label with unsaved changes, e.g. "Unsaved". */
    unsaved: string;
    /** Tooltip on the unsaved chip, e.g. "Click to save now". */
    unsavedTooltip: string;
    /** Visible label after a failed save, e.g. "Save failed". */
    saveFailed: string;
    /** Tooltip on the failed chip, e.g. "Click to retry — <detail>". */
    saveFailedTooltip: React.ReactNode;
    /** Visible label after a successful save, e.g. "Saved 3m ago" (already formatted by the caller). */
    saved: string;
    /** Visible label after a save that produced warnings, e.g. "Saved with warnings". */
    savedWithWarnings: string;
}

/** Optional "excluded nodes" note rendered next to the status chip. */
export interface SaveStateIndicatorExcluded {
    /** Visible label, e.g. "2 excluded". */
    label: string;
    /** Tooltip content explaining the exclusion. */
    tooltip: React.ReactNode;
}

export interface SaveStateIndicatorProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
    /**
     * Current save state. When omitted no status chip is rendered (e.g. a pristine, never-saved
     * document); only the {@link SaveStateIndicatorProps.excluded} note may still appear.
     */
    state?: SaveState;
    /**
     * Timestamp of the last successful save. Used for the `saved` chip's tooltip (localized clock
     * time via `toLocaleTimeString`). Only relevant while `state === "saved"` without warnings.
     */
    lastSavedAt?: Date | number;
    /** All displayed strings. */
    labels: SaveStateIndicatorLabels;
    /**
     * Warning/partial-error detail for a save that otherwise succeeded. When truthy while
     * `state === "saved"` the chip switches to the amber "saved with warnings" look and this
     * string becomes the tooltip (rendered with preserved line breaks).
     */
    warnings?: string;
    /** Called when the user clicks the `dirty` chip to save the pending changes. */
    onSave?: () => void;
    /** Called when the user clicks the `error` chip to retry the failed save. */
    onRetry?: () => void;
    /** Optional "excluded nodes" note rendered alongside the status chip. */
    excluded?: SaveStateIndicatorExcluded;
}

/**
 * Colour + interactivity recipe for a single status chip. The class strings are kept verbatim
 * from the original editor component so the rendered output is pixel-identical: the base holds
 * the shared flex/typography utilities, `tone` maps the state to its colour, and `interactive`
 * adds the button affordances (hover underline + focus ring) used by the `dirty`/`error` chips.
 */
const statusChipVariants = cva("flex items-center gap-1 text-xs", {
    variants: {
        tone: {
            destructive: "text-destructive",
            muted: "text-muted-foreground",
            warning: "text-warning",
            success: "text-success",
        },
        interactive: {
            true: "hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
            false: "",
        },
    },
    defaultVariants: {
        tone: "muted",
        interactive: false,
    },
});

type ChipTone = "destructive" | "muted" | "warning" | "success";

/** A tooltip-wrapped status chip. Rendered as a `<button>` when `onClick` is set, otherwise a `<span>`. */
function StatusChip({
    tone,
    icon,
    label,
    tooltip,
    tooltipClassName,
    onClick,
}: {
    tone: ChipTone;
    icon: React.ReactNode;
    label: React.ReactNode;
    tooltip: React.ReactNode;
    tooltipClassName?: string;
    onClick?: () => void;
}) {
    const chip = onClick ? (
        <button type="button" onClick={onClick} className={statusChipVariants({ tone, interactive: true })}>
            {icon}
            {label}
        </button>
    ) : (
        <span className={statusChipVariants({ tone })}>
            {icon}
            {label}
        </span>
    );
    return (
        <Tooltip>
            <TooltipTrigger asChild>{chip}</TooltipTrigger>
            <TooltipContent className={tooltipClassName}>{tooltip}</TooltipContent>
        </Tooltip>
    );
}

/**
 * A compact, presentational save-state indicator: a coloured chip (with an icon, label and
 * tooltip) reflecting whether a document is saving, has unsaved changes, failed to save, or was
 * saved — optionally accompanied by an "excluded nodes" note.
 *
 * This component is purely presentational: it holds no store/i18n wiring. The consuming app derives
 * the {@link SaveStateIndicatorProps.state}, supplies all {@link SaveStateIndicatorProps.labels}
 * and wires the `onSave`/`onRetry` callbacks.
 */
export const SaveStateIndicator = React.forwardRef<HTMLSpanElement, SaveStateIndicatorProps>(function SaveStateIndicator(
    { state, lastSavedAt, labels, warnings, onSave, onRetry, excluded, className = "", ...spanProps },
    ref
) {
    let status: React.ReactNode = null;
    if (state === "error") {
        status = (
            <StatusChip
                tone="destructive"
                icon={<CircleAlert className="h-3.5 w-3.5" />}
                label={labels.saveFailed}
                tooltip={labels.saveFailedTooltip}
                onClick={onRetry}
            />
        );
    } else if (state === "saving") {
        status = (
            <StatusChip
                tone="muted"
                icon={<Loader2 className="h-3.5 w-3.5 animate-spin" />}
                label={labels.saving}
                tooltip={labels.savingTooltip}
            />
        );
    } else if (state === "dirty") {
        status = (
            <StatusChip
                tone="warning"
                icon={<CircleDot className="h-3.5 w-3.5" />}
                label={labels.unsaved}
                tooltip={labels.unsavedTooltip}
                onClick={onSave}
            />
        );
    } else if (state === "saved") {
        // PUT errors got their own error toast, but the indicator should still reflect that the
        // save was only partial — the caller signals this by passing a non-empty `warnings` string.
        const hasWarnings = !!warnings;
        status = (
            <StatusChip
                tone={hasWarnings ? "warning" : "success"}
                icon={
                    hasWarnings ? <TriangleAlert className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />
                }
                label={hasWarnings ? labels.savedWithWarnings : labels.saved}
                tooltip={hasWarnings ? warnings : lastSavedAt != null ? new Date(lastSavedAt).toLocaleTimeString() : ""}
                tooltipClassName="max-w-xs whitespace-pre-line"
            />
        );
    }

    const excludedNote = excluded ? (
        <StatusChip
            tone="warning"
            icon={<TriangleAlert className="h-3.5 w-3.5" />}
            label={excluded.label}
            tooltip={excluded.tooltip}
            tooltipClassName="max-w-xs"
        />
    ) : null;

    if (!status && !excludedNote) return null;

    // Self-contained tooltip context (renders no DOM). The chips rely on it; wrapping here means the
    // consumer needs no ambient `TooltipProvider`. The default `delayDuration` (0) matches the app's
    // editor-level provider, so hover timing is unchanged.
    return (
        <TooltipProvider>
            <span ref={ref} className={cn("flex items-center gap-2", className)} {...spanProps}>
                {status}
                {excludedNote}
            </span>
        </TooltipProvider>
    );
});

export default SaveStateIndicator;
