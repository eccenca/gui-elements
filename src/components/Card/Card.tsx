import React from 'react';
import { Card as BlueprintCard } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: any;
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        elevation level of the Card, one of 0, 1 (default), 2, 3 and 4
    */
    elevation?: 0 | 1 | 2 | 3 | 4;
    /**
        do not add structural markup to the Card element (regarding document structure)
    */
    isOnlyLayout?: boolean;
    // do not allow
    interactive?: never;
}

function Card({
    children,
    className='',
    elevation=1,
    isOnlyLayout=false,
    ...otherProps
}: ICardProps) {
    const cardElement = (
        <BlueprintCard
            {...otherProps}
            elevation={elevation}
            className={`${eccgui}-card ` + className}
        >
            {children}
        </BlueprintCard>
    );

    // TODO: improve Card element so it is itself a section html element
    return isOnlyLayout === false ? <section>{cardElement}</section> : cardElement;
};

export default Card;
