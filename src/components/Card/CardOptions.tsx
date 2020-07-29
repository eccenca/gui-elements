import React from 'react';
import { OverviewItemActions } from './../OverviewItem';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function CardOptions({
    children,
    className='',
    ...otherProps
}: any) {
    return (
        <OverviewItemActions
            {...otherProps}
            className={
                `${eccgui}-card__options` +
                (className ? ' ' + className : '')
            }
        >
            {children}
        </OverviewItemActions>
    );
};

export default CardOptions;
