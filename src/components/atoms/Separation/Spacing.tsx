import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface SpacingProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Set the amount of white space that separates two elements.
     */
    size?: "tiny" | "small" | "medium" | "large" | "xlarge";
    /**
     * If set then is a ruler displayed in the middle of the spacing area.
     * The direction of the ruler is used from the spacing.
     */
    hasDivider?: boolean;
    /**
     * If set then the spacing separates two elements on the horizontal axis.
     * The spacing area then is created on a vertical axis.
     */
    vertical?: boolean;
}

// margin-top/-bottom per `size` for the (default) horizontal direction, on the standard
// Tailwind spacing scale (16px rem root): tiny 2px, small 4px, medium 8px, large 12px,
// xlarge 16px.
const marginYBySize: Record<NonNullable<SpacingProps["size"]>, string> = {
    tiny: "my-0.5",
    small: "my-1",
    medium: "my-2",
    large: "my-3",
    xlarge: "my-4",
};

// margin-left/-right per `size` for the vertical direction (same metrics as above, applied
// on the horizontal axis instead).
const marginXBySize: Record<NonNullable<SpacingProps["size"]>, string> = {
    tiny: "mx-0.5",
    small: "mx-1",
    medium: "mx-2",
    large: "mx-3",
    xlarge: "mx-4",
};

/**
 * Adds horizontal or vertical space between neighbouring elements.
 * It also can add a visual ruler inside.
 */
export const Spacing = ({ size = "medium", hasDivider = false, vertical = false, ...otherDivProps }: SpacingProps) => {
    const direction = vertical ? "vertical" : "horizontal";
    return (
        <div
            className={cn(
                `${eccgui}-separation__spacing-${direction}`,
                `${eccgui}-separation__spacing--${size}`,
                hasDivider && `${eccgui}-separation__spacing--hasdivider`,
                // structural metrics (was: shared box-sizing/padding rule + per-direction
                // display/width/height/vertical-align/margin rules in separation.scss)
                "box-content p-0",
                vertical ? "inline-block w-px h-[1.39em] align-text-bottom my-0" : "block w-full h-px ml-0 mr-0",
                vertical ? marginXBySize[size] : marginYBySize[size],
                // was: `.spacing--hasdivider { background-color: ...; border: none; }`
                hasDivider && "border-none bg-border"
            )}
            {...otherDivProps}
        />
    );
};

export default Spacing;
