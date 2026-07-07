import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import OverviewItemLine, { OverviewItemLineProps } from "./../OverviewItem/OverviewItemLine";

export interface CardTitleProps extends Omit<OverviewItemLineProps, "small" | "large"> {
    /**
     * Use only normal font size instead of a large one.
     */
    narrowed?: boolean;
}

/**
 * Display a card title, can include other markup like `h2`, `h3` and so on to define document structure.
 */
export const CardTitle = ({ children, className = "", narrowed = false, ...otherProps }: CardTitleProps) => {
    return (
        <OverviewItemLine
            {...otherProps}
            className={cn(
                `${eccgui}-card__title`,
                // per-intent text color is kept in `card.scss` (arbitrary `eccgui-intent--<x>` classNames
                // handed down from `Dialog/SimpleDialog.tsx`'s `intent` prop can't be resolved here statically)
                "font-normal [&>*]:[font-weight:inherit]",
                className,
            )}
            large={!narrowed}
        >
            {children}
        </OverviewItemLine>
    );
};

export default CardTitle;
