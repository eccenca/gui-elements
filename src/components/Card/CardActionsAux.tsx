import React from 'react';

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
                'ecc-card__actions__aux' +
                (className ? ' ' + className : '')
            }
        >
            {children}
        </div>
    );
};

export default CardActionsAux;
