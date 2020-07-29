import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function CardContent({
    children,
    className='',
    ...otherProps
}: any) {
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
