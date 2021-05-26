import React from 'react';
import { ButtonReplacement } from "./Button";

export function AffirmativeButtonReplacement ({
    children,
    ...otherProps
}: any) {
    return (
        <ButtonReplacement
            {...otherProps}
            affirmative={true}
        >
            {children}
        </ButtonReplacement>
    );
}
