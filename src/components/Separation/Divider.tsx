import React from "react";
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

export function Divider({
    className,
    addSpacing = "none",
    width = "full",
    alignment = "left",
    ...otherHrProps
}: DividerProps) {
    return (
        <hr
            className={
                `${eccgui}-separation__divider-horizontal` +
                (addSpacing !== "none" ? ` ${eccgui}-separation__spacing--${addSpacing}` : "") +
                (width !== "full" ? ` ${eccgui}-separation__divider-horizontal--${width}` : "") +
                (alignment !== "left" ? ` ${eccgui}-separation__divider-horizontal--${alignment}` : "") +
                (!!className ? ` ${className}` : "")
            }
            {...otherHrProps}
        />
    );
}

export default Divider;
