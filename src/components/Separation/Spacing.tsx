import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";


interface IProps {
    size?: "tiny" | "small" | "medium" | "large"
    hasDivider?: boolean
    vertical?: boolean
}

/** Adds horizontal or vertical space between neighbouring elements. */
function Spacing({ size = "medium", hasDivider = false, vertical = false }: IProps) {
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
