import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import * as TypographyClassNames from "./classnames";

// FIXME: CMEM-3742: comment + add story

export interface HtmlContentBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    small?: boolean;
    /** currently not supported */
    large?: boolean;
    /** currently not supported */
    muted ?: boolean;
    /** currently not supported */
    disabled?: boolean;
    linebreakForced?: boolean;
    linebreakPrevented?: boolean;
    noScrollbarsOnChildren?: boolean;
}

export const HtmlContentBlock = ({
    className = "",
    children,
    small = false,
    large = false,
    muted = false,
    disabled = false,
    linebreakForced = false,
    linebreakPrevented = false,
    noScrollbarsOnChildren = false,
    ...otherProps
}: HtmlContentBlockProps) => {
    return (
        <div
            className={
                `${eccgui}-typography__contentblock` +
                (className ? " " + className : "") +
                (small ? " " + TypographyClassNames.SMALL : "") +
                (large ? " " + TypographyClassNames.LARGE : "") +
                (muted ? " " + TypographyClassNames.MUTED : "") +
                (linebreakForced ? " " + TypographyClassNames.FORCELINEBREAK : "") +
                (linebreakPrevented ? " " + TypographyClassNames.PREVENTLINEBREAK : "") +
                (noScrollbarsOnChildren ? " " + TypographyClassNames.NOSCROLLBARSONCHILDREN : "") +
                (disabled ? " " + TypographyClassNames.DISABLED : "")
            }
            {...otherProps}
        >
            {children}
        </div>
    );
}

export default HtmlContentBlock;
