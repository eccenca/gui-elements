import React from 'react';
import { Card as BlueprintCard } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Card({
    children,
    className='',
    elevation=1,
    isOnlyLayout=false,
    fullHeight=false,
    ...otherProps
}: any) {
    const cardElement = (
        <BlueprintCard
            {...otherProps}
            elevation={elevation}
            className={`${eccgui}-card ` + className + (fullHeight ? ` ${eccgui}-card--fullheight` : '')}
        >
            {children}
        </BlueprintCard>
    );

    // TODO: improve Card element so it is itself a section html element
    return isOnlyLayout === false ? <section>{cardElement}</section> : cardElement;
};

export default Card;
