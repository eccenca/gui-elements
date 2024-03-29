import React from "react";

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
        <OverviewItemLine {...otherProps} className={`${eccgui}-card__title ` + className} large={!narrowed}>
            {children}
        </OverviewItemLine>
    );
};

export default CardTitle;
