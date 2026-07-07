import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { SpacingProps } from "./Spacing";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
    /**
     * Add whitespace arount the horizontal rule.
     */
    addSpacing?: "none" | SpacingProps["size"];
    /**
     * Set the width of the horizontal rule.
     */
    width?: "short" | "half" | "medium" | "full";
    /**
     * Set the horizontal alignment of the horizontal rule.
     * This is only visible for widths that are not set to `full`.
     */
    alignment?: "left" | "center" | "right";
}

// vertical margin per `addSpacing` size, translated from the legacy `separation.scss`
// metrics. `$eccgui-size-typo-base` (14px) is this library's own `html` root font-size
// (see `src/index.scss` Typography import), i.e. `1rem` === 14px in this app, so these
// Tailwind steps reproduce the old pixel values exactly: tiny 0.125rem = 1.75px,
// small 0.25rem = 3.5px, medium 0.5rem = 7px, large 0.75rem = 10.5px, xlarge 1rem = 14px.
const addSpacingMarginY: Record<NonNullable<SpacingProps["size"]>, string> = {
    tiny: "my-0.5",
    small: "my-1",
    medium: "my-2",
    large: "my-3",
    xlarge: "my-4",
};

const widthClasses: Record<NonNullable<DividerProps["width"]>, string> = {
    short: "w-[39%]",
    half: "w-1/2",
    medium: "w-[61%]",
    full: "w-full",
};

export function Divider({
    className,
    addSpacing = "none",
    width = "full",
    alignment = "left",
    ...otherHrProps
}: DividerProps) {
    return (
        <hr
            className={cn(
                `${eccgui}-separation__divider-horizontal`,
                // structural metrics (was: shared box-sizing/display/width/height/padding/margin
                // rule + the divider-only background-color/border rule in separation.scss)
                "box-content block h-px border-none bg-border p-0",
                widthClasses[width],
                addSpacing === "none" ? "my-0" : addSpacingMarginY[addSpacing],
                alignment === "left" ? "ml-0" : "ml-auto",
                alignment === "center" ? "mr-auto" : "mr-0",
                addSpacing !== "none" && `${eccgui}-separation__spacing--${addSpacing}`,
                width !== "full" && `${eccgui}-separation__divider-horizontal--${width}`,
                alignment !== "left" && `${eccgui}-separation__divider-horizontal--${alignment}`,
                className
            )}
            {...otherHrProps}
        />
    );
}

export default Divider;
