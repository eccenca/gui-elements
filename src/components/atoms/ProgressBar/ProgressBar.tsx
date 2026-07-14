import React from "react";

import { IntentTypes } from "@/common/Intent";
import { cn } from "@/common/utils/cn";

/**
 * Foundation-independent replacement for the historical Blueprint `ProgressBarProps`.
 * Rebuilt as a plain (non-Radix) div pair: Radix's `Progress` primitive treats an unset
 * `value` as "empty" (0%), whereas the historical Blueprint - and this component's - contract
 * is that an unset `value` means "indeterminate", rendered as a *full*, animated bar.
 * A plain pair gives full control over that behavior plus the exact 0..1 value semantics and
 * ARIA attributes, without fighting the vendored primitive's own conventions.
 */
export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
    /**
     * Whether the indeterminate bar animates (pulses) to signal ongoing activity.
     * Only takes effect while `stripes` is also `true`.
     *
     * @default true
     */
    animate?: boolean;

    /**
     * Kept for backwards compatibility. Together with `animate` it gates the indeterminate
     * activity animation (there is no longer a separate striped fill).
     *
     * @default true
     */
    stripes?: boolean;

    /**
     * A value between 0 and 1 (inclusive) representing how far along the operation is.
     * Values below 0 or above 1 will be interpreted as 0 or 1, respectively.
     * Omitting this prop will result in an "indeterminate" progress meter that fills the entire
     * bar (combined with `stripes`/`animate` to signal ongoing activity).
     */
    value?: number;

    /**
     * Visual intent of the progress meter.
     */
    intent?: IntentTypes;

    /**
     * Additional CSS class applied to the indicator (meter) element, i.e. the inner bar that is
     * sized/colored to represent progress. Useful for consumers that need to recolor the meter
     * itself (e.g. `ConfidenceValue`, which paints it with a computed `currentColor`) without
     * relying on a fragile DOM-shape-dependent selector on the outer `className`.
     */
    meterClassName?: string;
}

// Fill color per resolved intent. Unset/unmapped intents (including "none") fall back to the
// stock shadcn `bg-primary`; an explicit intent picks a semantic token color instead.
const intentMeterClass: Partial<Record<IntentTypes, string>> = {
    primary: "bg-primary",
    accent: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
    info: "bg-info",
    neutral: "bg-foreground",
};

/**
 * Displays a horizontal progress meter, either determinate (`value` given, `0..1`) or
 * indeterminate (no `value`: a full bar that pulses to signal activity).
 */
export const ProgressBar = ({
    className,
    animate = true,
    stripes = true,
    value,
    intent,
    meterClassName,
    ...otherProps
}: ProgressBarProps) => {
    const clampedValue = value == null ? undefined : Math.min(1, Math.max(0, value));
    const isIndeterminate = clampedValue == null;
    const percent = clampedValue == null ? 100 : clampedValue * 100;
    const meterColorClass = (intent && intentMeterClass[intent]) || "bg-primary";

    // Stock shadcn Progress recipe: a `bg-primary/20` track with a token-colored indicator that
    // reveals `percent` via a horizontal translate (the indicator is `w-full` and shifted left).
    return (
        <div
            {...otherProps}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={isIndeterminate ? undefined : Math.round(percent)}
            className={cn("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", className)}
        >
            <div
                className={cn(
                    "h-full w-full flex-1 transition-all",
                    meterColorClass,
                    // Indeterminate bars pulse to signal ongoing activity (stock utility, no custom
                    // keyframes); gated by `animate`+`stripes` so both props keep an observable effect.
                    isIndeterminate && animate && stripes && "animate-pulse",
                    meterClassName
                )}
                style={{ transform: `translateX(-${100 - percent}%)` }}
            />
        </div>
    );
};

export default ProgressBar;
