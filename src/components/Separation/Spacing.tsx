import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Spacing({ size = "medium", hasDivider = false, vertical = false }: any) {
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
