import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
}

/**
 * Holds the card content.
 * Display scrollbars in case there is not enough space for it.
 */
function CardContent({
    children,
    className='',
    ...otherProps
}: CardContentProps) {
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
