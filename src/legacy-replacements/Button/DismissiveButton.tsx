import React from 'react';
import { ButtonReplacement } from "./Button";

export function DismissiveButtonReplacement ({
    children,
    ...otherProps
}: any) {
    return (
        <ButtonReplacement
            {...otherProps}
            dismissive={true}
        >
            {children}
        </ButtonReplacement>
    );
}
