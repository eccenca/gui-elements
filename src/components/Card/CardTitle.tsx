import React from 'react';
import { OverviewItemLine } from './../OverviewItem';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function CardTitle({
    children,
    className='',
    narrowed=false,
    ...otherProps
}: any) {
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
