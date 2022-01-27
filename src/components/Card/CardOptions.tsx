import React from 'react';
import OverviewItemActions, { OverviewItemActionsProps } from './../OverviewItem/OverviewItemActions';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface CardOptionsProps extends Omit<OverviewItemActionsProps, "hiddenInteractions"> {

}

/**
 * Container for elements that allow user-interaction, e.g. buttons or context menus.
 * Can contain multiple of them.
 * Is displayed right-aligned in the `CardHeader`.
 */
function CardOptions({
    children,
    className='',
    ...otherProps
}: CardOptionsProps) {
    return (
        <OverviewItemActions
            {...otherProps}
            className={
                `${eccgui}-card__options` +
                (className ? ' ' + className : '')
            }
        >
            {children}
        </OverviewItemActions>
    );
};

export default CardOptions;
