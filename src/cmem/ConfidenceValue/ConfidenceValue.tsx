import React from "react";
import Color from "color";
import { Tag, TagProps } from "./../../components/Tag";
import { ProgressBar, ProgressBarProps } from "./../../components/ProgressBar";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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
    barColor?: Color | string;
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
    progressBarProps?: Omit<ProgressBarProps, "className">;
}

export function ConfidenceValue ({
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

    const barValue = (
        value === centerValue ? 0 :
        value < centerValue ? value / (minValue - centerValue) :
        value / (maxValue - centerValue)
    );

    let color = Color("#000000");
    if (!!barColor) {
        try {
            color = Color(barColor);
        } catch(ex) {
            console.warn("Received invalid color for confidence bar: " + barColor)
        }
    }

    return (
        <span
            className={
                `${eccgui}-confidencevalue` +
                ` ${eccgui}-confidencevalue--${barStart}` +
                ` ${eccgui}-confidencevalue--${spaceUsage}space` +
                (value < centerValue ? ` ${eccgui}-confidencevalue--negative` : ` ${eccgui}-confidencevalue--positive`) +
                (className ? ` ${className}` : "")
            }
            {...otherProps}
        >
            <Tag
                className={`${eccgui}-confidencevalue__value`}
                {...tagProps}
            >
                {value}
            </Tag>
            <div
                className={`${eccgui}-confidencevalue__bar-colorwrapper`}
                style={!!barColor ? { color: color.rgb().toString() } : {}}
            >
                <ProgressBar
                    className={`${eccgui}-confidencevalue__bar`}
                    value={barValue}
                    intent={!!barColor ? undefined : value < centerValue ? "danger" : "success"}
                    stripes={false}
                    animate={false}
                    {...progressBarProps}
                />
            </div>
        </span>
    );
}
