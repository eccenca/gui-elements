import React from 'react';

interface ICardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: any;
    /**
        space-delimited list of class names
    */
    className?: string;
}

function CardContent({
    children,
    className='',
    ...otherProps
}: ICardContentProps) {
    return (
        <div
            {...otherProps}
            className={'ecc-card__content ' + className}
        >
            {children}
        </div>
    );
};

export default CardContent;
