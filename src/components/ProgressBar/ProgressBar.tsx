import React from "react";

import { IntentTypes } from "../../common/Intent";
import { cn } from "../../common/utils/cn";

/**
 * Foundation-independent replacement for the historical Blueprint `ProgressBarProps`.
 * Rebuilt as a plain (non-Radix) div pair: Radix's `Progress` primitive treats an unset
 * `value` as "empty" (0%), whereas the historical Blueprint - and this component's - contract
 * is that an unset `value` means "indeterminate", rendered as a *full*, animated/striped bar.
 * A plain pair gives full control over that behavior plus the exact 0..1 value semantics and
 * ARIA attributes, without fighting the vendored primitive's own conventions.
 */
export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
    /**
     * Whether the background should animate.
     * Only visible while `stripes` is also `true`.
     *
     * @default true
     */
    animate?: boolean;

    /**
     * Whether the background should be striped.
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
}

// Fill color per resolved intent. Unset/unmapped intents (including "none") fall back to a
// neutral gray, matching the historical Blueprint default (no intent = plain gray meter, only
// an explicit intent picks a color).
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
 * indeterminate (no `value`: a full bar, optionally striped/animated to signal activity).
 */
export const ProgressBar = ({
    className,
    animate = true,
    stripes = true,
    value,
    intent,
    ...otherProps
}: ProgressBarProps) => {
    const clampedValue = value == null ? undefined : Math.min(1, Math.max(0, value));
    const percent = clampedValue == null ? 100 : clampedValue * 100;
    const meterColorClass = (intent && intentMeterClass[intent]) || "bg-muted-foreground";

    return (
        <div
            {...otherProps}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clampedValue == null ? undefined : Math.round(percent)}
            className={cn(
                "relative block h-2 w-full overflow-hidden rounded-full bg-muted",
                // Legacy Blueprint-shaped hooks, kept only for the transition: `cmem/ConfidenceValue`
                // and `cmem/ActivityControl` still carry their own SCSS overrides keyed off these
                // exact classnames (`.bp6-progress-bar` / `.bp6-progress-meter`), and Blueprint's own
                // progress-bar partial is still imported globally (`includes/blueprintjs/_components.scss`)
                // during this phase. They stop mattering once that global import is dropped (Phase 4).
                "bp6-progress-bar",
                !animate && "bp6-no-animation",
                !stripes && "bp6-no-stripes",
                className
            )}
        >
            <div
                className={cn(
                    "bp6-progress-meter",
                    "h-full rounded-full transition-[width] duration-300 ease-out",
                    meterColorClass,
                    stripes &&
                        "bg-[linear-gradient(-45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%)] bg-[length:1rem_1rem]",
                    // A true scrolling "barber pole" would need a custom `@keyframes` (either a global
                    // stylesheet addition, out of scope here, or an inline `<style>` tag, which risks
                    // being blocked by a strict style-src CSP). `animate-pulse` is a stock utility that
                    // still visibly signals "activity in progress", gated by the same
                    // `stripes && animate` condition Blueprint used for its scrolling animation.
                    stripes && animate && "animate-pulse"
                )}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
};

export default ProgressBar;
