import React from "react";
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
     *
     */
    // TODO: color
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
            <ProgressBar
                className={`${eccgui}-confidencevalue__bar`}
                value={barValue}
                intent={value < centerValue ? "danger" : "success"}
                stripes={false}
                animate={false}
                {...progressBarProps}
            />
        </span>
    );
}
