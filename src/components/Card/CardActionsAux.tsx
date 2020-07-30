import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface ICardActionsAuxProps extends React.HTMLAttributes<HTMLDivElement> {
    children: any;
    /**
        space-delimited list of class names
    */
    className?: string;
}

function CardActionsAux ({
    children,
    className='',
    ...otherProps
}: ICardActionsAuxProps) {
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
