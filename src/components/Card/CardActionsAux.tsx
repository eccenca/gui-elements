import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function CardActionsAux ({
    children,
    className='',
    ...otherProps
}: any) {
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
