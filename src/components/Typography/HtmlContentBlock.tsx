import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import * as TypographyClassNames from "./classnames";

function HtmlContentBlock({
    className = "",
    children,
    small = false, // currently unsupported
    large = false, // currently unsupported
    muted = false, // currently unsupported
    disabled = false, // currently unsupported
    ...otherProps
}: any) {
    return (
        <div
            className={
                `${eccgui}-typography__contentblock` +
                (className ? " " + className : "") +
                (small ? " " + TypographyClassNames.SMALL : "") +
                (large ? " " + TypographyClassNames.LARGE : "") +
                (muted ? " " + TypographyClassNames.MUTED : "") +
                (disabled ? " " + TypographyClassNames.DISABLED : "")
            }
        >
            {children}
        </div>
    );
}

export default HtmlContentBlock;
