import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function CardActions ({
    children,
    className='',
    inverseDirection=false,
    ...otherProps
}: any) {
    return (
        <footer
            {...otherProps}
            className={
                `${eccgui}-card__actions` +
                (inverseDirection ? ` ${eccgui}-card__actions--inversedirection` : '') +
                (className ? ' ' + className : '')
            }
        >
            {children}
        </footer>
    );
};

export default CardActions;
