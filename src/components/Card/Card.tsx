import React from 'react';
import {
    Card as BlueprintCard,
    CardProps as BlueprintCardProps
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface CardProps extends BlueprintCardProps {
    /**
     * `<Card />` element is included in DOM as simple `div` element.
     * By default it is a HTML `section`.
     */
    isOnlyLayout?: boolean;
    /**
     * Take the full height of container to display the card.
     */
    fullHeight?: boolean;
    /**
     * Background color is slightly altered to differ card display from other cards.
     */
    elevated?: boolean;
    /**
     * When card (or its children) get focus the card is scrolled into the viewport.
     * Property value defined which part of the card is always scrolled in, this may important when the card is larger than the viewport.
     */
    scrollinOnFocus?: "start" | "center" | "end";
}

/**
 * Element to separate content sections from each other.
 * Cards can include other cards but should not.
 */
function Card({
    children,
    className='',
    elevation=1,
    isOnlyLayout=false,
    fullHeight=false,
    elevated=false,
    scrollinOnFocus,
    interactive,
    ...otherProps
}: CardProps) {
    const scrollIn = !!scrollinOnFocus ? {
        tabIndex: 0,
        onFocus: (e: any) => {
            const el = e.target.closest(".diapp-iframewindow__content");
            setTimeout(()=>{if (el) el.scrollIntoView({
                behavior: "smooth",
                block: scrollinOnFocus,
                inline: scrollinOnFocus,
            })}, 200);
        }
    } : {}
    const cardElement = (
        <BlueprintCard
            className={
                `${eccgui}-card ` +
                (fullHeight ? ` ${eccgui}-card--fullheight ` : '') +
                (elevated ? ` ${eccgui}-card--elevated ` : '') +
                (!!scrollinOnFocus ? ` ${eccgui}-card--scrollonfocus ` : '') +
                className
            }
            elevation={elevation}
            interactive={!!otherProps.onClick ? true : interactive}
            {...scrollIn}
            {...otherProps}
        >
            {children}
        </BlueprintCard>
    );

    // FIXME: improve Card element so it is itself a section html element
    return isOnlyLayout === false ? <section>{cardElement}</section> : cardElement;
};

export default Card;
