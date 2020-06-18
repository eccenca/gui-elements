import React from 'react';

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
                'ecc-card__actions' +
                (inverseDirection ? ' ecc-card__actions--inversedirection' : '') +
                (className ? ' ' + className : '')
            }
        >
            {children}
        </footer>
    );
};

export default CardActions;
