import React from 'react';
import { OverviewItemActions } from './../OverviewItem';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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
                `${eccgui}-card__options` +
                (className ? ' ' + className : '')
            }
        >
            {children}
        </OverviewItemActions>
    );
};

export default CardOptions;
