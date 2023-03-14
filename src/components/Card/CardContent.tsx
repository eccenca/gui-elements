import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Usually `CardContent` remains the available space inside a card.
     * This option changes that behaviour, so that the content section is not grown or shrinked.
     * You may use this then you have multiple content section in one card but not all those sections should be grown or shrinked regarding the remaining space.
     */
    noFlexHeight?: boolean;
}

/**
 * Holds the card content.
 * Display scrollbars in case there is not enough space for it.
 */
function CardContent({
    children,
    className='',
    noFlexHeight,
    ...otherProps
}: CardContentProps) {
    return (
        <div
            {...otherProps}
            className={
                `${eccgui}-card__content` +
                (noFlexHeight ? ` ${eccgui}-card__content--noflexheight` : "") +
                (!!className ? ` ${className}` : "")
            }
        >
            {children}
        </div>
    );
};

export default CardContent;
