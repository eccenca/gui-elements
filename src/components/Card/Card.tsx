import React from 'react';
import {
    Card as BlueprintCard,
    ICardProps as BlueprintCardProps
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface CardProps extends BlueprintCardProps {
    isOnlyLayout?: boolean;
    fullHeight?: boolean;
    elevated?: boolean;
}

function Card({
    children,
    className='',
    elevation=1,
    isOnlyLayout=false,
    fullHeight=false,
    elevated=false,
    interactive,
    ...otherProps
}: CardProps) {
    const cardElement = (
        <BlueprintCard
            className={
                `${eccgui}-card ` +
                (fullHeight ? ` ${eccgui}-card--fullheight ` : '') +
                (elevated ? ` ${eccgui}-card--elevated ` : '') +
                className
            }
            elevation={elevation}
            interactive={!!otherProps.onClick ? true : interactive}
            {...otherProps}
        >
            {children}
        </BlueprintCard>
    );

    // TODO: improve Card element so it is itself a section html element
    return isOnlyLayout === false ? <section>{cardElement}</section> : cardElement;
};

export default Card;
