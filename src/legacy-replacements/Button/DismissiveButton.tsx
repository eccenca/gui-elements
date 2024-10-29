import React from "react";

import { ButtonReplacement } from "./Button";

/** @deprecated (v25) all legacy component support will be removed, switch to `<Button dismissive />` */
export function DismissiveButtonReplacement({ children, ...otherProps }: any) {
    return (
        <ButtonReplacement {...otherProps} dismissive={true}>
            {children}
        </ButtonReplacement>
    );
}
