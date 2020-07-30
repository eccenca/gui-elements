import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface ICardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    children: any;
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        change direction of button alignment, default: false
    */
    inverseDirection?: boolean;
}

function CardActions ({
    children,
    className='',
    inverseDirection=false,
    ...otherProps
}: ICardActionsProps) {
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
