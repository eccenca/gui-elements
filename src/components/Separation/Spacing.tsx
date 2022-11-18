import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface SpacingProps {
    /**
     * Set the amount of white space that separates two elements.
     */
    size?: "tiny" | "small" | "medium" | "large"
    /**
     * If set then is a ruler displayed in the middle of the spacing area.
     * The direction of the ruler is used from the spacing.
     */
    hasDivider?: boolean
    /**
     * If set then the spacing separates two elements on the horizontal axis.
     * The spacing area then is created on a vertical axis.
     */
    vertical?: boolean
}

/**
 * Adds horizontal or vertical space between neighbouring elements.
 * It also can add a visual ruler inside.
 */
function Spacing({ size = "medium", hasDivider = false, vertical = false }: SpacingProps) {
    const direction = vertical ? "vertical" : "horizontal";
    return (
        <div
            className={
                `${eccgui}-separation__spacing-` + direction +
                ` ${eccgui}-separation__spacing--` + size +
                (hasDivider ? ` ${eccgui}-separation__spacing--hasdivider` : "")
            }
        />
    );
}

export default Spacing;
