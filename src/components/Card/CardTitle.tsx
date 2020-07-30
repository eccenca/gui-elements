import React from 'react';
import { OverviewItemLine } from './../OverviewItem';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface ICardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    children: any;
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        card title will display bit smaller compared to regular titles
    */
    narrowed?: boolean;
}

function CardTitle({
    children,
    className='',
    narrowed=false,
    ...otherProps
}: ICardTitleProps) {
    return (
        <OverviewItemLine
            {...otherProps}
            className={`${eccgui}-card__title ` + className}
            large={!narrowed}
        >
            {children}
        </OverviewItemLine>
    );
};

export default CardTitle;
