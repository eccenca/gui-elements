import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverviewItemProps extends React.HTMLAttributes<HTMLDivElement> {
}

/**
 * Additional side buttons inside `CardActions`.
 * Elements are aligned to the other side of the container.
 */
function CardActionsAux ({
    children,
    className='',
    ...otherProps
}: OverviewItemProps) {
    return (
        <div
            {...otherProps}
            className={
                `${eccgui}-card__actions__aux` +
                (className ? ' ' + className : '')
            }
        >
            {children}
        </div>
    );
};

export default CardActionsAux;
