import React, { useEffect, useState } from "react";
import Color, { ColorLike } from "color";

import { IntentTypes } from "@/common/Intent";
import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

type SpinnerPosition = "local" | "inline" | "global";
type SpinnerSize = "tiny" | "small" | "medium" | "large" | "xlarge" | "inherit";
type SpinnerStroke = "thin" | "medium" | "bold";

/**
 * Additional properties for the backdrop/container elements rendered for `position="global"`.
 * Foundation-independent replacement for the historical Blueprint `OverlayProps`.
 */
export interface SpinnerOverlayProps {
    /**
     * Additional class name for the fixed, full-viewport container element.
     */
    className?: string;
    /**
     * Additional properties for the fixed, full-viewport container element.
     */
    containerProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "className">;
    /**
     * Additional class name for the backdrop element rendered behind the spinner.
     */
    backdropClassName?: string;
    /**
     * Additional properties for the backdrop element rendered behind the spinner.
     */
    backdropProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "className">;
}

/** A spinner that is either displayed globally or locally. */
export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
    /**
     * Must be a valid css color definition.
     * `intent` property will always overwrite this setting.
     */
    color?: ColorLike | "inherit";
    /**
     * Intent state of the spinner.
     * When used the spinner is colored.
     * Property overwrites `elevated` setting.
     */
    intent?: IntentTypes;
    /**
     * Highlight the spinner.
     * It is displayed with accent color intent.
     */
    elevated?: boolean;
    /**
     * Additional CSS class names.
     */
    className?: string;
    /**
     * Position where and how the spinner is displayed:
     * * `local`: the spinner is displayed as centered overlay to the neareast parent with relative (or equivalent) positioning
     * * `inline`: the spinner is displayed as inline element
     * * `global`: the spinner is displayed including backdrop centered over the full viewport
     */
    position?: SpinnerPosition;
    /**
     * The size of the spinner.
     * The default size relates to the `position`.
     */
    size?: SpinnerSize;
    /**
     * The stroke width that is used to visualize the spinner.
     * The default size relates to the `position`.
     * There are only rare cases to set this property,
     */
    stroke?: SpinnerStroke;
    /**
     * Delay when to show the spinner in ms.
     */
    delay?: number;
    /**
     * Includes a backdrop behind the spinner that narrows visibility of the area behind the spinner.
     * This option only works with "local" spinners, for "inline" spinners there is no backdrop, "global" spinners always have backdrops.
     * The backdrop and the spinner are located over the nearest parent element that is styled by `position: relative` or some other CSS rule with an equivalent outcome.
     */
    showLocalBackdrop?: boolean;
    /**
     * Use this property to alter the display of the backdrop used for the global spinner
     */
    overlayProps?: SpinnerOverlayProps;
    /**
     * A value between 0 and 1 (inclusive) representing how far along the operation is.
     * Values below 0 or above 1 will be interpreted as 0 or 1, respectively.
     * Omitting this prop results in an "indeterminate" spinner where the head spins indefinitely.
     */
    value?: number;
    /**
     * HTML tag for the outer wrapper element.
     * @default "span" when `position` is `inline`, `div` otherwise.
     */
    tagName?: "div" | "span";
}

// Geometry of the ring, in SVG viewBox units (viewBox is always "0 0 100 100").
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const strokeWidths: Record<SpinnerStroke, number> = {
    thin: 4,
    medium: 8,
    bold: 14,
};

// Physical size of the rendered ring per `size`. Downsized from the Carbon-era values to a
// compact modern scale (tiny=16, small=24, medium=32, large=48, xlarge=64px).
const sizeClasses: Record<SpinnerSize, string> = {
    tiny: "size-4",
    small: "size-6",
    medium: "size-8",
    large: "size-12",
    xlarge: "size-16",
    inherit: "size-[1em]",
};

// Text-color utility per resolved intent. "none" (and unset) intentionally has no entry,
// i.e. no color is enforced and the `color` prop (or inherited color) is used instead -
// this mirrors the historical behavior where an explicit `intent` (including "none") always
// took precedence over the `color` prop, while an actually *unset* intent let `color` apply.
const intentTextClass: Partial<Record<IntentTypes, string>> = {
    primary: "text-primary",
    // historically a distinct "accent" brand color; the current token set only defines a
    // single brand blue (`--primary`), so `accent`/`elevated` resolve to the same utility.
    accent: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
    info: "text-info",
    neutral: "text-foreground",
};

export const Spinner = ({
    className = "",
    color = "inherit",
    intent,
    elevated,
    position = "local",
    size,
    stroke,
    showLocalBackdrop = false,
    delay = 0,
    overlayProps,
    value,
    tagName,
    ...otherProps
}: SpinnerProps) => {
    const [showSpinner, setShowSpinner] = useState<boolean>(!delay || delay <= 0);
    useEffect(() => {
        if (!showSpinner) {
            const timeoutId = setTimeout(() => setShowSpinner(true), delay);
            return () => clearTimeout(timeoutId);
        }
        return;
    }, [showSpinner, delay]);

    let spinnerSize: SpinnerSize;
    let spinnerStroke: SpinnerStroke;
    switch (position) {
        case "local":
            spinnerSize = size ?? "medium";
            spinnerStroke = stroke ?? "medium";
            break;
        case "global":
            spinnerSize = size ?? "large";
            spinnerStroke = stroke ?? "thin";
            break;
        case "inline":
            spinnerSize = size ?? "inherit";
            spinnerStroke = stroke ?? "bold";
            break;
        default:
            spinnerSize = size ?? "medium";
            spinnerStroke = stroke ?? "medium";
    }

    // `intent` always overwrites `elevated`, matching the historical behavior.
    const effectiveIntent: IntentTypes | undefined = intent ?? (elevated ? "accent" : undefined);
    const intentColorClass = effectiveIntent ? intentTextClass[effectiveIntent] : undefined;

    const isIndeterminate = value == null;
    const arcFraction = isIndeterminate ? 0.25 : Math.min(1, Math.max(0, value));
    const dashOffset = CIRCUMFERENCE * (1 - arcFraction);

    const SpinnerTag = tagName ?? (position === "inline" ? "span" : "div");

    // Historical `${eccgui}-spinner*` classnames, kept byte-identical so external CSS/tests
    // that still key off them (e.g. `TagInput`, `InteractionGate`, `ActivityControl`) keep working.
    const legacyClassName =
        `${eccgui}-spinner` +
        ` ${eccgui}-spinner--position-${position}` +
        (elevated ? ` ${eccgui}-spinner--intent-accent` : "") +
        (intent ? ` ${eccgui}-spinner--intent-${intent}` : "") +
        ` ${eccgui}-spinner--size-${spinnerSize}` +
        (showLocalBackdrop ? ` ${eccgui}-spinner--localbackdrop` : "");

    let spinner = (
        <SpinnerTag
            role="progressbar"
            aria-label="loading"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={isIndeterminate ? undefined : Math.round(arcFraction * 100)}
            {...otherProps}
            className={cn(
                legacyClassName,
                "flex h-full items-center justify-center overflow-hidden",
                position === "inline" && "inline-flex h-auto align-text-top",
                showLocalBackdrop && "absolute inset-0 bg-background/50",
                intentColorClass,
                className
            )}
        >
            {/*
                The whole <svg> spins via the stock `animate-spin` utility when indeterminate.
                The head circle's own `rotate(-90 ...)` *presentation attribute* lives on a
                different element than the animated CSS `transform`, so the two compose cleanly
                instead of one clobbering the other.
            */}
            <svg
                viewBox="0 0 100 100"
                aria-hidden="true"
                className={cn("block", sizeClasses[spinnerSize], isIndeterminate && "animate-spin")}
            >
                <circle
                    cx="50"
                    cy="50"
                    r={RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={0.25}
                    strokeWidth={strokeWidths[spinnerStroke]}
                />
                <circle
                    cx="50"
                    cy="50"
                    r={RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidths[spinnerStroke]}
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 50 50)"
                    className="transition-[stroke-dashoffset] duration-300 ease-out"
                />
            </svg>
        </SpinnerTag>
    );

    if (!effectiveIntent) {
        try {
            const spinnerColor = color === "inherit" ? color : Color(color).rgb().toString();
            spinner = <span style={{ color: spinnerColor }}>{spinner}</span>;
        } catch {
            spinner = <span style={{ color: "inherit" }}>{spinner}</span>;
            // eslint-disable-next-line no-console
            console.warn("Spinner received invalid color property: " + color);
        }
    }

    return position === "global" ? (
        <div
            {...overlayProps?.containerProps}
            className={cn(
                "fixed inset-0 z-[var(--eccgui-zindex-overlays)] flex items-center justify-center",
                `${eccgui}-spinner__overlay`,
                overlayProps?.className
            )}
        >
            <div
                {...overlayProps?.backdropProps}
                className={cn(
                    "absolute inset-0 bg-background/50",
                    `${eccgui}-spinner__backdrop`,
                    overlayProps?.backdropClassName
                )}
            />
            {spinner}
        </div>
    ) : showSpinner ? (
        spinner
    ) : null;
};

export default Spinner;
