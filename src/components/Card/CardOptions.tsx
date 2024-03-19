import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import OverviewItemActions, { OverviewItemActionsProps } from "./../OverviewItem/OverviewItemActions";

export type CardOptionsProps = Omit<OverviewItemActionsProps, "hiddenInteractions">;

/**
 * Container for elements that allow user-interaction, e.g. buttons or context menus.
 * Can contain multiple of them.
 * Is displayed right-aligned in the `CardHeader`.
 */
export const CardOptions = ({ children, className = "", ...otherProps }: CardOptionsProps) => {
    return (
        <OverviewItemActions {...otherProps} className={`${eccgui}-card__options` + (className ? " " + className : "")}>
            {children}
        </OverviewItemActions>
    );
};

export default CardOptions;
