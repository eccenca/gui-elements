import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Usually `CardContent` uses all the remaining space inside a card.
     * This behaviour can be changed by this option, so that the content section is not vertically grown or shrinked.
     * You may use this then you have multiple content sections in one card but not all those sections should be grown or shrinked regarding the remaining space.
     */
    noFlexHeight?: boolean;
}

/**
 * Holds the card content.
 * Display scrollbars in case there is not enough space for it.
 */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({
    children,
    className='',
    noFlexHeight,
    ...otherProps
}: CardContentProps, ref) => {
    return (
        <div
            {...otherProps}
            ref={ref}
            className={
                `${eccgui}-card__content` +
                (noFlexHeight ? ` ${eccgui}-card__content--noflexheight` : "") +
                (!!className ? ` ${className}` : "")
            }
        >
            {children}
        </div>
    );
});
