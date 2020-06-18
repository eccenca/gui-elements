import React from 'react';
import { OverviewItemActions } from './../OverviewItem';

interface ICardOptionsProps extends React.HTMLAttributes<HTMLDivElement> {
    children: any;
    /**
        space-delimited list of class names
    */
    className?: string;
}

function CardOptions({
    children,
    className='',
    ...otherProps
}: ICardOptionsProps) {
    return (
        <OverviewItemActions
            {...otherProps}
            className={
                'ecc-card__options' +
                (className ? ' ' + className : '')
            }
        >
            {children}
        </OverviewItemActions>
    );
};

export default CardOptions;
