import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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
            className={`${eccgui}-card__content ` + className}
        >
            {children}
        </div>
    );
};

export default CardContent;
