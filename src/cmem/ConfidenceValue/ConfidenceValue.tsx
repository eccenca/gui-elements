import React from "react";
import Color, { ColorLike } from "color";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import { ProgressBar, ProgressBarProps } from "@/components/atoms/ProgressBar";
import { Tag, TagProps } from "@/components/atoms/Tag";

export interface ConfidenceValueProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
    /**
     * Confidence value.
     */
    value: number;
    /**
     * Minimal border for the confidence range.
     */
    minValue?: number;
    /**
     * Center (or average) value of the confidence range.
     */
    centerValue?: number;
    /**
     * Maximum border for the confidence range.
     */
    maxValue?: number;
    /**
     * Color of the confidence bar.
     * By default it is colorized red for values below the `centerValue`, otherwise green.
     */
    barColor?: ColorLike;
    /**
     * The value is displayed by a bar.
     * This confidence bar can be start from the left or right side, or from the center of the element.
     */
    barStart?: "side" | "center";
    /**
     * What width is used to display the lement.
     * It could use the `minimal` necessary space, the `maximal` available space, or a `static` width.
     */
    spaceUsage?: "minimal" | "static" | "maximal";
    /**
     * Additional properties for the `<Tag/>` element that is used to display the confidence value.
     */
    tagProps?: Omit<TagProps, "className">;
    /**
     * Additional properties for the `<PRogressBar/>` element that is used to display the confidence bar.
     */
    progressBarProps?: Omit<ProgressBarProps, "className" | "meterClassName">;
}

const toPercent = (n: number) => {
    const formatted = (n * 100).toFixed(2);
    const maybeRemovedFraction = formatted.replace(/(\.0+$)|(0+$)/, "");
    return `${maybeRemovedFraction}%`;
};

export function ConfidenceValue({
    className,
    value,
    minValue = -1,
    maxValue = 1,
    centerValue = 0,
    barColor,
    barStart = "side",
    spaceUsage = "static",
    tagProps,
    progressBarProps,
    ...otherProps
}: ConfidenceValueProps) {
    const barValue =
        value === centerValue
            ? 0
            : value < centerValue
              ? value / (minValue - centerValue)
              : value / (maxValue - centerValue);

    let color = Color("#000000");
    if (barColor) {
        try {
            color = Color(barColor);
        } catch {
            // eslint-disable-next-line no-console
            console.warn("Received invalid color for confidence bar: " + barColor);
        }
    }

    const isCenter = barStart === "center";
    const isNegative = value < centerValue;

    return (
        <span
            className={cn(
                `${eccgui}-confidencevalue`,
                `${eccgui}-confidencevalue--${barStart}`,
                `${eccgui}-confidencevalue--${spaceUsage}space`,
                isNegative ? `${eccgui}-confidencevalue--negative` : `${eccgui}-confidencevalue--positive`,
                // former `.eccgui-confidencevalue` rules (confidencevalue.scss): pinned 70px width
                // (was `5rem` authored against the pre-restyle 14px root - kept fixed in px so it
                // does not silently grow now that the root is 16px), overridden to `auto` by the
                // `minimal`/`maximalspace` variants below (matching column-aligned badges in dense
                // lists/tables vs. the non-fixed variants).
                "relative inline-block w-[70px]",
                spaceUsage === "minimal" && "w-auto min-w-0",
                spaceUsage === "maximal" && "w-auto min-w-full",
                className,
            )}
            {...otherProps}
        >
            <Tag className={cn(`${eccgui}-confidencevalue__value`, "w-full text-center")} {...tagProps}>
                {toPercent(value)}
            </Tag>
            <div
                className={`${eccgui}-confidencevalue__bar-colorwrapper`}
                style={barColor ? { color: color.rgb().toString() } : {}}
            >
                <ProgressBar
                    className={cn(
                        `${eccgui}-confidencevalue__bar`,
                        // former `.eccgui-confidencevalue__bar` rules: an absolutely-positioned
                        // thin strip along the bottom edge, growing from the side (default) or the
                        // center, optionally mirrored for negative values.
                        "absolute bottom-0 left-0 h-[3px] w-full bg-transparent",
                        isCenter && "left-1/2 w-1/2",
                        isNegative && "rotate-180",
                        isCenter && isNegative && "left-0 right-1/2",
                    )}
                    value={barValue}
                    intent={barColor ? undefined : isNegative ? "danger" : "success"}
                    stripes={false}
                    animate={false}
                    {...progressBarProps}
                    // former `.eccgui-confidencevalue__bar-colorwrapper .bp6-progress-meter {
                    // background-color: currentcolor }` (confidencevalue.scss): recolor the meter to
                    // the `barColor`-derived `currentColor` set on the wrapper's inline style above,
                    // via `ProgressBar`'s `meterClassName` hook instead of a DOM-shape-dependent
                    // descendant selector. Only set when `barColor` is given, so the normal
                    // danger/success intent coloring above applies undisturbed otherwise.
                    meterClassName={barColor ? "bg-current" : undefined}
                />
            </div>
        </span>
    );
}
